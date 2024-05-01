import AnimationSchema, { AnimateSchema } from '@/modules/Animation/schemas/AnimationSchema'
import { toDom } from 'hast-util-to-dom'
import { defaultSchema, sanitize } from 'hast-util-sanitize'
import deepmerge from 'deepmerge'
import anime from 'animejs'
import { buildCSS, transformAnimeConfig } from '@/modules/Animation/helpers'

export function parseAnimationData (data) {
  data = typeof data === 'string' ? JSON.parse(data) : data

  return AnimationSchema().parse(data)
}

/**
 * @param data
 * @param context {{
 *     node,
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
          if (s === '{node}') return `${parent} + *`
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
          typeof a === 'function'
            ? a(wrapper)
            : anime(transformAnimeConfig(a, wrapper))
        )
      )
      const pause = () => instances.forEach(i => i.pause())
      const finished = () => Promise.all(instances.map(i => i.finished))

      if (before && context.type === 'enter') {
        pause()
        const instance = before(context)
        instance.finished.then(() => instances.slice(1).forEach(i => i.play()))
        instances.unshift(instance)
      }

      if (after && context.type === 'exit') {
        const instance = after(context)
        instance.pause()
        finished().then(() => instance.play())
        instances.push(instance)
      }

      return {
        instances,
        finished: finished(),
        pause
      }
    }
  }
}
