import { z } from 'zod'
import { Literal } from '@/utils/schemas'

const ObjectDeepSchema = (schema, extend = []) => z.union([
  Literal,
  z.symbol(),
  z.instanceof(Function),
  z.instanceof(Element),
  ...extend,
  z.array(schema),
  z.record(schema)
])

export default ObjectDeepSchema
