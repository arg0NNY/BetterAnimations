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
 *     easing
 * }}
 */
export function buildAnimateAssets (data, context) {
  data = AnimateSchema(context).parse(data)

  let wrapper
  if (data.hast || data.css) {
    const id = Date.now().toString()
    wrapper = document.createElement('div')
    wrapper.setAttribute('data-animation', id)

    let nodes, style

    if (data.hast) {
      nodes = [].concat(data.hast).map(node => toDom(sanitize(
        node,
        deepmerge(defaultSchema, { attributes: {'*': ['className']} })
      )))
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
    execute: () => Promise.all(
      [].concat(data.anime).map(
        a => (
          typeof a === 'function'
            ? a(wrapper)
            : anime(transformAnimeConfig(a, wrapper))
        ).finished
      )
    )
  }
}
