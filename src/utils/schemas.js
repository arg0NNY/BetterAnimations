import { z } from 'zod'
import Inject from '@/enums/Inject'

export const Literal = z.union([z.string(), z.number(), z.boolean(), z.null(), z.undefined()])
export const Defined = z.any().refine(v => v !== undefined, { message: 'Must be defined' })
export const ArrayOrSingleSchema = value => z.union([z.array(value), value])

export const buildSwitchSchema = (keys, value = Defined) => Object.fromEntries([].concat(keys).map(k => [k.toString(), value]))

export const formatValuesList = (arr, separator = ', ') => arr.map(i => `'${i}'`).join(separator)

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

export const parseInjectSchemas = schemas => Object.fromEntries(
  Object.entries(schemas)
    .filter(([key]) => key.endsWith('InjectSchema'))
    .map(([key, schema]) => [
      Inject[key.replace(/InjectSchema$/, '')],
      schema
    ])
)
