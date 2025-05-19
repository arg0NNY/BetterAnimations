import { z } from 'zod'
import { ArrayOrSingleSchema, Defined, DOMElementSchema, formatValuesList } from '@/utils/schemas'
import { clearSourceMap, SourceMappedObjectSchema } from '@animation/sourceMap'
import { InjectableValidateSchema } from '@animation/schemas/InjectableSchema'
import Inject from '@shared/enums/Inject'

export const InjectSchema = type => SourceMappedObjectSchema.extend({
  inject: z.literal(type)
}).strict()

export const hasInSettings = (name, has) => (value, ctx) => {
  if (!has) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Used '${name}' inject while the corresponding setting is not defined in the animation\'s settings`,
      path: ['inject']
    })
    return z.NEVER
  }
  return value
}

export function InjectWithMeta (
  schema,
  {
    immediate = false,
    lazy = false,
    allowed = null
  } = {}
) {
  if (Array.isArray(schema)) return schema
  return [schema, { immediate, lazy, allowed }]
}

export const parseInjectSchemas = schemas => Object.fromEntries(
  Object.entries(schemas)
    .filter(([key]) => key.endsWith('InjectSchema'))
    .map(([key, schema]) => [
      Inject[key.replace(/InjectSchema$/, '')],
      InjectWithMeta(schema)
    ])
)

export const buildSwitchSchema = (keys, value = Defined) => Object.fromEntries([].concat(keys).map(k => [k.toString(), value]))

export function SwitchSchema (inject, valueList, options = {}) {
  const { currentValue, defaultValue, possibleValues, setting } = options

  return context => {
    const get = value => typeof value === 'function' ? value(context) : value

    let values = get(valueList)

    let schema = InjectSchema(inject)
      .extend(buildSwitchSchema(values, Defined.optional()))

    if (setting) schema = schema.transform(hasInSettings(inject, setting in context.settings))

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

function _queryElement(target, selector, multiple = false) {
  if (!target) return null
  if (multiple) return Array.from(target.querySelectorAll(selector))
  return target.querySelector(selector)
}
export function queryElement (ctx, target, selector, multiple = false) {
  try {
    const matched = _queryElement(target, selector, multiple)
    if (Array.isArray(matched) ? !matched.length : !matched) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Couldn't find any element${multiple ? 's' : ''} matching the selector: '${selector}'`
      })
      return z.NEVER
    }
    return matched
  }
  catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid selector: '${selector}'`
    })
    return z.NEVER
  }
}

export function ElementSchema (inject, element = null, allowDirect = true) {
  return InjectSchema(inject)
    .extend({
      selector: allowDirect ? z.string().optional() : z.string(),
      multiple: z.boolean().optional().default(false)
    })
    .transform(
      ({ selector, multiple }, ctx) => selector != null
        ? queryElement(ctx, element, selector, multiple)
        : element
    )
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

export const TargetSchema = (context, multiple = false) => z.union([
  z.string(),
  DOMElementSchema
]).transform(
  (target, ctx) => typeof target === 'string'
    ? queryElement(ctx, context.wrapper, target, multiple)
    : target
)
export const TargetsSchema = context => ArrayOrSingleSchema(
  ArrayOrSingleSchema(
    TargetSchema(context, true).nullable()
  )
)
  .transform(targets => [].concat(targets).flat().filter(t => t != null))
  .refine(
    targets => targets.length > 0,
    { message: 'No targets specified' }
  )
