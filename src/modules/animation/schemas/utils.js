import { z } from 'zod'
import { ArrayOrSingleSchema, buildSwitchSchema, Defined, formatValuesList, hasInSettings } from '@/utils/schemas'
import { clearSourceMap, SourceMappedObjectSchema } from '@/modules/animation/sourceMap'
import { InjectableValidateSchema } from '@/modules/animation/schemas/InjectableSchema'

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

export const ParametersSchema = z.record(z.string(), z.any())
  .superRefine((value, ctx) => {
    const { success } = InjectableValidateSchema.safeParse(value)
    if (!success) ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Illegal value',
      params: { received: value }
    })
  })

function queryTarget (target, context, multiple = false) {
  if (!context.wrapper) return null
  if (multiple) return Array.from(context.wrapper.querySelectorAll(target))
  return context.wrapper.querySelector(target)
}
export const TargetSchema = (context, multiple = false) => z.union([
  z.string(),
  z.instanceof(Element)
]).transform((target, ctx) => {
  if (typeof target === 'string') {
    try {
      const matched = queryTarget(target, context, multiple)
      if (Array.isArray(matched) ? !matched.length : !matched) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Couldn't find any target${multiple ? 's' : ''} matching selector: '${target}'`,
          params: { received: target }
        })
        return z.NEVER
      }
      return matched
    }
    catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid selector: '${target}'`,
        params: { received: target }
      })
      return z.NEVER
    }
  }
  return target
})
export const TargetsSchema = context => ArrayOrSingleSchema(
  TargetSchema(context, true).nullable()
).transform(targets => [].concat(targets).flat().filter(t => t != null))
  .refine(
    targets => targets.length > 0,
    { message: 'No targets specified' }
  )
