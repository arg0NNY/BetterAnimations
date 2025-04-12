import * as z from 'zod'
import { buildSwitchSchema, Defined, formatValuesList, hasInSettings } from '@/utils/schemas'
import { clearSourceMap, SourceMappedObjectSchema } from '@/modules/animation/sourceMap'

export const InjectSchema = type => SourceMappedObjectSchema.extend({
  inject: z.literal(type)
}).strict()

export function SwitchSchema (inject, valueList, options = {}) {
  const { currentValue, defaultValue, possibleValues, setting } = options

  return context => {
    const get = value => typeof value === 'function' ? value(context) : value

    let values = get(valueList)

    let schema = InjectSchema(inject)
      .extend(buildSwitchSchema(values, Defined.optional()))

    if (setting) schema = schema.transform(hasInSettings(inject, !!context.settings?.[setting]))

    return schema.transform((params, ctx) => {
      params = clearSourceMap(params)

      if (get(possibleValues))
        values = values.filter(v => get(possibleValues).includes(v))
      else if (setting && context.settings[setting] !== true)
        values = values.filter(v => context.settings[setting].includes(v))

      let value = get(currentValue) ?? (setting && context[setting])
      if (!values.includes(value)) value = defaultValue

      if (values.some(k => k in params))
        if (values.every(k => k in params)) return params[value]
        else {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `All of the possible values must be defined in the '${inject}' inject when using switch mode. Missing keys: ${formatValuesList(values.filter(k => !(k in params)))}`
          })
          return z.NEVER
        }
      else return value
    })
  }
}

export function InjectWithMeta (
  schema,
  {
    immediate = false,
    lazy = false,
    allowed = null
  }
) {
  return [schema, { immediate, lazy, allowed }]
}

export function ElementSchema (inject, element = null, allowDirect = true) {
  return InjectSchema(inject)
    .extend({
      querySelector: z.string().optional(),
      querySelectorAll: z.string().optional()
    })
    .transform((params, ctx) => {
      if (!allowDirect && !('querySelector' in params || 'querySelectorAll' in params)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Inject '${inject}' can't be used directly and must define either 'querySelector' or 'querySelectorAll'`
        })
        return z.NEVER
      }
      if ('querySelector' in params && 'querySelectorAll' in params) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Inject '${inject}' can't have both 'querySelector' and 'querySelectorAll' defined in pair`
        })
        return z.NEVER
      }
      if (!element) return null
      if (params.querySelectorAll) return Array.from(element.querySelectorAll(params.querySelectorAll))
      if (params.querySelector) return element.querySelector(params.querySelector)
      return element
    })
}
