import anime from 'animejs'
import { buildCSS, transformAnimeConfig } from '@/modules/animation/helpers'
import AnimationType from '@/enums/AnimationType'
import { AnimateSchema } from '@/modules/animation/schemas/AnimationSchema'
import ParseStage from '@/enums/ParseStage'
import ErrorManager from '@/modules/ErrorManager'
import AnimationError from '@/structs/AnimationError'
import { formatZodError } from '@/helpers/zod'
import { executeWithZod } from '@/modules/animation/utils'
import { z } from 'zod'
import Debug from '@/modules/Debug'

export function buildContext (pack, animation, type, settings = {}, context = {}) {
  return Object.assign(
    {
      pack,
      animation,
      settings: animation?.settings,
      meta: animation?.meta,
      type,
      vars: {}
    },
    settings,
    context
  )
}

export function buildWrapper (data, context) {
  if (!data.hast && !data.css) return null

  const id = `${context.module.id}-${context.type}-${Date.now()}`
  const wrapper = document.createElement('div')

  wrapper.setAttribute('data-animation', id)

  let style
  if (data.css) {
    const parent = `[data-animation="${id}"]`
    style = document.createElement('style')
    style.appendChild(document.createTextNode(
      buildCSS(data.css, s => {
        if (s.startsWith('{element}')) return s.replace('{element}', `${parent} + *`)
        if (s === '{container}') return `[data-animation-container]:has(> ${parent})`
        return `${parent} :is(${s})`
      })
    ))
  }

  wrapper.append(
    ...[].concat(data.hast)
      .concat(style)
      .filter(i => i instanceof Element)
  )
  return wrapper
}

export function buildAnimateAssets (data = null, context, options = {}) {
  const debug = Debug.animation(context.animation, context.type)
  debug.parseStart(data, context)

  try {
    data = data ? AnimateSchema(context, { stage: ParseStage.Layout })
      .parse(data) : {}
  }
  catch (error) {
    ErrorManager.registerAnimationError(
      new AnimationError(
        context.animation,
        formatZodError(error, { pack: context.pack, path: context.path, received: data }),
        { module: context.module, pack: context.pack, type: context.type, context, stage: 'Layout' }
      )
    )
    context.instance.cancel(true)
    return {}
  }

  context.wrapper = data ? buildWrapper(data, context) : null
  try {
    data = data ? AnimateSchema(context, { stage: ParseStage.Execute })
      .parse(data) : {}
  }
  catch (error) {
    ErrorManager.registerAnimationError(
      new AnimationError(
        context.animation,
        formatZodError(error, { pack: context.pack, path: context.path, received: data }),
        { module: context.module, pack: context.pack, type: context.type, context, stage: 'Execute' }
      )
    )
    context.instance.cancel(true)
    return {}
  }

  debug.parseEnd(data, context)

  const before = options.before && context.type === AnimationType.Enter
    ? options.before(context)
    : null
  const after = options.after && context.type === AnimationType.Exit
    ? options.after(context)
    : null
  const instance = before?.execute() ?? after?.execute() ?? null
  instance?.pause()

  const exposedHook = hook => () => {
    debug.hook(hook, context)
    data[hook]?.()
    before?.[hook]?.()
    after?.[hook]?.()
  }

  return {
    wrapper: context.wrapper,
    onBeforeCreate: exposedHook('onBeforeCreate'),
    onBeforeDestroy: exposedHook('onBeforeDestroy'),
    onDestroyed: exposedHook('onDestroyed'),
    execute: () => {
      const instances = [].concat(data.anime ?? []).map(
        (value, i) => {
          if (!value) return null
          return executeWithZod(value, (value, ctx) => {
            try {
              return typeof value === 'function' // Can be a function because of "anime.timeline" inject
                ? value(context.wrapper)
                : anime(transformAnimeConfig(value, context.wrapper))
            }
            catch (error) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: error.message,
                params: { error, received: value }
              })
              return z.NEVER
            }
          }, context, { path: ['anime'].concat(Array.isArray(data.anime) ? [i] : []) })
        }
      ).filter(Boolean)

      const pauseAll = () => instances.forEach(i => i.pause())
      const finishedAll = () => Promise.all(instances.map(i => i.finished))
      context.instance.instances = instances
      context.instance.pause = pauseAll
      if (context.instance.cancelled) return {}

      debug.hook('onCreated', context)
      data.onCreated?.()
      if (context.instance.cancelled) return {}

      if (before) {
        pauseAll()

        instance.finished.then(() => {
          before.onCompleted?.()
          debug.hook('onBeforeBegin', context)
          data.onBeforeBegin?.()
          instances.slice(1).forEach(i => {
            i.reset()
            i.play()
          })
        })
        instances.unshift(instance)
        Promise.resolve().then(() => {
          before.onBeforeBegin?.()
          instance.reset()
          instance.play()
        })
      }

      const finished = finishedAll()
      if (after) instances.push(instance)

      return {
        instances,
        onBeforeBegin: !before ? () => {
          debug.hook('onBeforeBegin', context)
          data.onBeforeBegin?.()
        } : null,
        pause: pauseAll,
        finished: finished
          .then(() => {
            debug.hook('onCompleted', context)
            data.onCompleted?.()
            if (context.instance.cancelled) return

            if (after) {
              instance.reset()
              instance.play()
              after.onCreated?.()
              after.onBeforeBegin?.()
              return instance.finished.then(() => after.onCompleted?.())
            }
          })
      }
    }
  }
}
