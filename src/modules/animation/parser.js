import anime from 'animejs'
import AnimationType from '@/enums/AnimationType'
import ParsableAnimateSchema from '@/modules/animation/schemas/ParsableAnimateSchema'
import ParseStage from '@/enums/ParseStage'
import ErrorManager from '@/modules/ErrorManager'
import AnimationError from '@/structs/AnimationError'
import { formatZodError } from '@/utils/zod'
import { buildCSS, executeWithZod, transformAnimeConfig } from '@/modules/animation/utils'
import { z } from 'zod'
import Debug from '@/modules/Debug'
import Setting from '@/enums/AnimationSetting'
import { EasingType } from '@/enums/Easing'
import { getDuration } from '@/utils/easings'
import { MAX_ANIMATION_DURATION, MIN_ANIMATION_DURATION } from '@/data/constants'
import { clearSourceMapDeep } from '@/modules/animation/sourceMap'

function buildDurationContext (animation, settings) {
  const easing = settings?.[Setting.Easing]
  if (easing?.type === EasingType.Spring) {
    const { from, to } = animation.settings?.[Setting.Duration] ?? { from: MIN_ANIMATION_DURATION, to: MAX_ANIMATION_DURATION }
    const duration = getDuration(easing)
    return {
      value: Math.max(from, Math.min(to, duration)),
      computedBy: 'easing',
      exceeds: duration < from ? -1 : duration > to ? 1 : 0
    }
  }

  return {
    value: settings?.[Setting.Duration],
    computedBy: null,
    exceeds: 0
  }
}

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
    {
      duration: buildDurationContext(animation, settings)
    },
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
    style = [].concat(
      clearSourceMapDeep(data.css)
    ).map(css => {
      const element = document.createElement('style')
      element.appendChild(document.createTextNode(
        buildCSS(css, s => {
          if (s.startsWith('{element}')) return s.replace('{element}', `${parent} + *`)
          if (s === '{container}') return `[data-animation-container]:has(> ${parent})`
          return `${parent} :is(${s})`
        })
      ))
      return element
    })
  }

  wrapper.append(
    ...[].concat(data.hast)
      .concat(style)
      .filter(i => i instanceof Element)
  )
  return wrapper
}

export function buildAnimateAssets (data = null, context, options = {}) {
  context = context ?? {}
  const debug = context.animation ? Debug.animation(context.animation, context.type) : null

  const parseStage = stage => {
    debug?.parseStart(stage, data, context)
    try {
      data = data ? ParsableAnimateSchema(context, { stage })
        .parse(data, { path: context.path }) : {}

      debug?.parseEnd(stage, data, context)
      return true
    }
    catch (error) {
      ErrorManager.registerAnimationError(
        error instanceof AnimationError ? error : new AnimationError(
          context.animation,
          formatZodError(error, { pack: context.pack, data, context }),
          { module: context.module, pack: context.pack, type: context.type, context }
        )
      )
      context.instance.cancel(true)
      return false
    }
  }

  const hook = (name, stage) => {
    debug?.hook(name, context)
    if (!parseStage(stage)) return false
    data[name]?.()
    return !context.instance.cancelled
  }

  parsing: {
    if (!hook('onBeforeCreate', ParseStage.BeforeCreate)) break parsing

    if (!parseStage(ParseStage.Layout)) break parsing

    context.wrapper = data ? buildWrapper(data, context) : null

    if (!parseStage(ParseStage.Anime)) break parsing
  }

  const before = options.before && context.type === AnimationType.Enter
    ? options.before(context)
    : null
  const after = options.after && context.type === AnimationType.Exit
    ? options.after(context)
    : null
  const instance = before?.execute() ?? after?.execute() ?? null
  instance?.pause()

  const sharedHook = (name, stage) => () => {
    before?.[name]?.()
    after?.[name]?.()
    return hook(name, stage)
  }

  return {
    wrapper: context.wrapper,
    onBeforeDestroy: sharedHook('onBeforeDestroy', ParseStage.BeforeDestroy),
    onDestroyed: sharedHook('onDestroyed', ParseStage.Destroyed),
    execute: () => {
      const config = clearSourceMapDeep(data.anime)
      const instances = [].concat(config ?? []).map(
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
          }, context, { path: [...context.path, 'anime'].concat(Array.isArray(config) ? [i] : []) })
        }
      ).filter(Boolean)

      const pauseAll = () => instances.forEach(i => i.pause())
      const finishedAll = () => Promise.all(instances.map(i => i.finished))
      context.instance.instances = instances
      context.instance.pause = pauseAll
      if (context.instance.cancelled) return {}

      if (!hook('onCreated', ParseStage.Created)) return {}

      if (before) {
        pauseAll()

        instance.finished.then(() => {
          before.onCompleted?.()
          hook('onBeforeBegin', ParseStage.BeforeBegin)
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
        onBeforeBegin: !before ? () => hook('onBeforeBegin', ParseStage.BeforeBegin) : null,
        pause: pauseAll,
        finished: finished
          .then(() => {
            if (!hook('onCompleted', ParseStage.Completed)) return

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
