import { z } from 'zod'
import { buildSwitchSchema } from '@/helpers/schemas'
import { InjectSchema } from '@/modules/Animation/schemas/injects/InjectSchema'

export const NodeInjectSchema = ({ node }) => InjectSchema('node')
  .extend({
    querySelector: z.string().optional(),
    querySelectorAll: z.string().optional()
  })
  .transform((params, ctx) => {
    if ('querySelector' in params && 'querySelectorAll' in params) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Inject type 'node' can't have both 'querySelector' and 'querySelectorAll' defined in pair` })
      return z.NEVER
    }
    if (params.querySelectorAll) return node.querySelectorAll(params.querySelectorAll)
    if (params.querySelector) return node.querySelector(params.querySelector)
    return node
  })

export const TypeInjectSchema = ({ type }) => InjectSchema('type')
  .extend(buildSwitchSchema(['enter', 'exit']))
  .transform(params => params[type])

export const ObjectAssignInjectSchema = InjectSchema('Object.assign').extend({
  target: z.record(z.any()),
  source: z.union([z.record(z.any()), z.record(z.any()).array()])
}).transform(params => Object.assign(params.target, ...[].concat(params.source)))

export const WaitInjectSchema = InjectSchema('wait').extend({
  duration: z.number().positive()
}).transform(params => ({
  targets: { inject: 'node' },
  translateY: [0, 0],
  duration: params.duration
}))

export const StringTemplateSchema = InjectSchema('string.template').extend({
  template: z.string(),
  values: z.union([z.record(z.string()), z.string().array()])
}).transform(({ template, values }) => template.replaceAll(
  /\${([^\${}\s]+)}/g,
  (_, key) => values[Array.isArray(values) ? +key : key] ?? ''
))
