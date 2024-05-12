import { z } from 'zod'
import { buildSwitchSchema } from '@/helpers/schemas'
import { InjectSchema } from '@/modules/animation/schemas/injects/InjectSchema'
import evaluate from '@emmetio/math-expression'
import Inject from '@/enums/Inject'
import AnimationType from '@/enums/AnimationType'

export const NodeInjectSchema = ({ node }) => InjectSchema(Inject.Node)
  .extend({
    querySelector: z.string().optional(),
    querySelectorAll: z.string().optional()
  })
  .transform((params, ctx) => {
    if ('querySelector' in params && 'querySelectorAll' in params) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Inject type '${Inject.Node}' can't have both 'querySelector' and 'querySelectorAll' defined in pair` })
      return z.NEVER
    }
    if (params.querySelectorAll) return node.querySelectorAll(params.querySelectorAll)
    if (params.querySelector) return node.querySelector(params.querySelector)
    return node
  })

export const TypeInjectSchema = ({ type }) => InjectSchema(Inject.Type)
  .extend(buildSwitchSchema(AnimationType.values()))
  .transform(params => params[type])

export const ObjectAssignInjectSchema = InjectSchema(Inject.ObjectAssign).extend({
  target: z.record(z.any()),
  source: z.union([z.record(z.any()), z.record(z.any()).array()])
}).transform(params => Object.assign(params.target, ...[].concat(params.source)))

export const WaitInjectSchema = InjectSchema(Inject.Wait).extend({
  duration: z.number().positive()
}).transform(params => ({
  targets: { inject: 'node' },
  translateY: [0, 0],
  duration: params.duration
})) // TODO: https://github.com/juliangarnier/anime/wiki/What's-new-in-Anime.js-V4#-timers

export const StringTemplateSchema = InjectSchema(Inject.StringTemplate).extend({
  template: z.string(),
  values: z.union([z.record(z.any()), z.any().array()])
}).transform(({ template, values }) => template.replaceAll(
  /\${([^\${}\s]+)}/g,
  (_, key) => String(values[Array.isArray(values) ? +key : key]) ?? ''
))

export const MathInjectSchema = InjectSchema(Inject.Math).extend({
  expression: z.string()
}).transform(({ expression }, ctx) => {
  try { return evaluate(expression) }
  catch (e) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: e.message + ` "${expression}"` })
    return z.NEVER
  }
})
