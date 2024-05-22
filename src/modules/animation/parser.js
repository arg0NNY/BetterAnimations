import { AnimateSchema } from '@/modules/animation/schemas/AnimationSchema'
import { toDom } from 'hast-util-to-dom'
import { defaultSchema, sanitize } from 'hast-util-sanitize'
import deepmerge from 'deepmerge'
import anime from 'animejs'
import { buildCSS, transformAnimeConfig } from '@/modules/animation/helpers'
import AnimationType from '@/enums/AnimationType'

export function buildContext (animation, type, settings = {}, context = {}) {
  return Object.assign(
    {
      settings: animation?.settings,
      meta: animation?.meta,
      type
    },
    settings,
    context
  )
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
export function buildAnimateAssets (data = null, context = {}, options = {}) {
  const { before, after } = options
  data = data ? AnimateSchema(context).parse(data) : {}

  let wrapper
  if (data.hast || data.css) {
    const id = Date.now().toString()
    wrapper = document.createElement('div')
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
          if (s === '{element}') return `${parent} + *`
          if (s === '{container}') return `[data-animation-container]:has(> ${parent})`
          return `${parent} :is(${s})`
        })
      ))
    }

    wrapper.append(...[].concat(nodes).concat(style).filter(n => !!n))
  }

  return {
    node: wrapper,
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

      if (before && context.type === AnimationType.Enter) {
        pauseAll()
        const instance = before(context)
        instance.finished.then(() => instances.slice(1).forEach(i => i.play()))
        instances.unshift(instance)
      }

      return {
        pause: pauseAll,
        finished: finishedAll()
          .then(() => after && context.type === AnimationType.Exit && after(context).finished)
      }
    }
  }
}
