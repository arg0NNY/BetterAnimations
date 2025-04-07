import { z } from 'zod'
import { ArrayOrSingleSchema } from '@/utils/schemas'

const ArrayOrSingleObjectSchema = ArrayOrSingleSchema(z.record(z.any()))

const AnimateSchema = z.object({
  onBeforeCreate: ArrayOrSingleObjectSchema,
  hast: ArrayOrSingleObjectSchema,
  css: ArrayOrSingleObjectSchema,
  anime: ArrayOrSingleObjectSchema,
  onCreated: ArrayOrSingleObjectSchema,
  onBeforeBegin: ArrayOrSingleObjectSchema,
  onCompleted: ArrayOrSingleObjectSchema,
  onBeforeDestroy: ArrayOrSingleObjectSchema,
  onDestroyed: ArrayOrSingleObjectSchema
}).partial().strict()

export default AnimateSchema
