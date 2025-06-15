import { z } from 'zod'
import { ObjectDeepBaseSchema } from '@animation/schemas/ObjectDeepSchema'
import TrustedFunctionSchema from '@animation/schemas/TrustedFunctionSchema'

const InjectableBaseSchema = (schema, extend = []) =>
  ObjectDeepBaseSchema(schema, [TrustedFunctionSchema, ...extend])

export const InjectableDefaultBaseSchema = z.lazy(
  () => InjectableBaseSchema(InjectableDefaultBaseSchema)
)

export default InjectableBaseSchema
