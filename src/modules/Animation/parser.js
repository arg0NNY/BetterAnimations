import AnimationSchema from '@/modules/Animation/schemas/AnimationSchema'
import { toDom } from 'hast-util-to-dom'
import { defaultSchema, sanitize } from 'hast-util-sanitize'
import deepmerge from 'deepmerge'
import { toCSS } from 'cssjson'
import anime from 'animejs'

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
export function parseAnimationData (data, context) {
  data = typeof data === 'string' ? JSON.parse(data) : data
  context = Object.assign(context, {
    availableVariants: data.settings?.variant?.map(v => v.key),
    hasDuration: !!data.settings?.duration,
    hasEasing: !!data.settings?.easing,
  })

  return AnimationSchema(context).parse(data)
}

export function buildAnimationAssets (data) {
  return {
    nodes: data.hast && [].concat(data.hast).map(node => toDom(sanitize(
      node,
      deepmerge(defaultSchema, { attributes: {'*': ['className']} })
    ))),
    css: data.css && toCSS(data.css),
    execute: () => Promise.all(
      [].concat(data.anime).map(
        a => (typeof a === 'function' ? a() : anime(a)).finished
      )
    )
  }
}
