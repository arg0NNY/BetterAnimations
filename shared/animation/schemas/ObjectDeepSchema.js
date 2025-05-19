import { z } from 'zod'
import { DOMElementSchema, FunctionSchema, Literal } from '@/utils/schemas'
import { SourceMapSchema } from '@animation/sourceMap'
import { LazyInjectSchema } from '@animation/schemas/injects/lazy'

export const ObjectDeepBaseSchema = (schema, extend = []) => z.union([
  Literal,
  z.symbol(),
  DOMElementSchema,
  SourceMapSchema,
  LazyInjectSchema,
  ...extend,
  z.array(schema),
  z.record(schema)
])

const ObjectDeepSchema = (schema, extend = []) =>
  ObjectDeepBaseSchema(schema, [FunctionSchema, ...extend])

export default ObjectDeepSchema
