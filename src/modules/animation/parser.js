import { toDom } from 'hast-util-to-dom'
import { defaultSchema, sanitize } from 'hast-util-sanitize'
import deepmerge from 'deepmerge'
import anime from 'animejs'
import { buildCSS, transformAnimeConfig } from '@/modules/animation/helpers'
import AnimationType from '@/enums/AnimationType'
import { AnimateSchema } from '@/modules/animation/schemas/AnimationSchema'
import ParseStage from '@/enums/ParseStage'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

export function buildContext (animation, type, settings = {}, context = {}) {
  return Object.assign(
    {
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

  let nodes, style

  if (data.hast) {
    nodes = [].concat(data.hast).map((node, i) => {
      const sanitized = sanitize(
        node,
        deepmerge(defaultSchema, { attributes: {'*': ['className']} })
      )
      if (sanitized.type === 'root')
        throw new Error(`Failed to parse hast node at "hast.${i}"`)

      return toDom(sanitized)
    })
  }

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

  wrapper.append(...[].concat(nodes).concat(style).filter(n => !!n))

  return wrapper
}

/**
 * @param data
 * @param context {{
 *     element,
 *     type,
 *     variant,
 *     duration,
 *     easing,
 *     position
 * }}
 * @param options
 */
export function buildAnimateAssets (data = null, context, options = {}) {
  const { before, after } = options
  data = data ?? {}

  const wrapper = buildWrapper(data, context)

  try {
    data = AnimateSchema({ ...context, wrapper }, { stage: ParseStage.Execute })
      .parse(data)
  }
  catch (e) {
    e = e instanceof z.ZodError ? fromZodError(e).message : e
    console.error(`Failed to parse '${context.type}' animation:`, e)
  }

  return {
    wrapper,
    onBeforeCreate: data.onBeforeCreate,
    onBeforeDestroy: data.onBeforeDestroy,
    onDestroyed: data.onDestroyed,
    execute: () => {
      const instances = [].concat(data.anime ?? []).map(
        a => (
          typeof a === 'function' // Can be a function because of "anime.timeline" inject
            ? a(wrapper)
            : anime(transformAnimeConfig(a, wrapper))
        )
      )
      const pauseAll = () => instances.forEach(i => i.pause())
      const finishedAll = () => Promise.all(instances.map(i => i.finished))
      data.onCreated?.()

      if (before && context.type === AnimationType.Enter) {
        pauseAll()
        const instance = before(context)
        instance.finished.then(() => {
          data.onBeforeBegin?.()
          instances.slice(1).forEach(i => i.play())
        })
        instances.unshift(instance)
      }
      else data.onBeforeBegin?.()

      return {
        pause: pauseAll,
        finished: finishedAll()
          .then(() => {
            data.onCompleted?.()
            return after && context.type === AnimationType.Exit && after(context).finished
          })
      }
    }
  }
}
