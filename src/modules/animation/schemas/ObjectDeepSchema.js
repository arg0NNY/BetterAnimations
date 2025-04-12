import * as z from 'zod'
import { Literal } from '@/utils/schemas'
import { SourceMapSchema } from '@/modules/animation/sourceMap'
import { LazyInjectSchema } from '@/modules/animation/schemas/injects/lazy'

export const ObjectDeepBaseSchema = (schema, extend = []) => z.union([
  Literal,
  z.symbol(),
  z.instanceof(Element),
  SourceMapSchema,
  LazyInjectSchema,
  ...extend,
  z.array(schema),
  z.record(schema)
])

const ObjectDeepSchema = (schema, extend = []) =>
  ObjectDeepBaseSchema(schema, [z.instanceof(Function), ...extend])

export default ObjectDeepSchema
