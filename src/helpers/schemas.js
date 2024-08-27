import { z } from 'zod'
import Inject from '@/enums/Inject'

export const Literal = z.union([z.string(), z.number(), z.boolean(), z.null()])
export const Defined = z.any().refine(v => v !== undefined, { message: 'Must be defined' })
export const ArrayOrSingleSchema = value => z.union([z.array(value), value])

export const buildSwitchSchema = (keys, value = Defined) => Object.fromEntries([].concat(keys).map(k => [k, value]))

export const formatValuesList = (arr, separator = ', ') => arr.map(i => `'${i}'`).join(separator)

export const hasInSettings = (name, has) => (value, ctx) => {
  if (!has) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Used '${name}' inject while it is not defined in the animation\'s settings` })
    return z.NEVER
  }
  return value
}

export const matchesSchema = schema => (value, ctx) => {
  const { success, data, error } = schema.safeParse(value)

  if (!success) {
    error.issues.forEach(i => ctx.addIssue(i))
    return z.NEVER
  }
  return data
}

export const parseInjectSchemas = schemas => Object.fromEntries(
  Object.entries(schemas).map(
    ([key, schema]) => [
      Inject[key.replace(/InjectSchema$/, '')],
      schema
    ]
  )
)
