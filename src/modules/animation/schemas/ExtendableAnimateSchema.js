import { z } from 'zod'
import { ArrayOrSingleSchema } from '@/utils/schemas'
import { SourceMappedObjectSchema } from '@/modules/animation/sourceMap'

const ArrayOrSingleObjectSchema = ArrayOrSingleSchema(z.record(z.any()))

export const AnimateSchema = SourceMappedObjectSchema.extend({
  onBeforeLayout: ArrayOrSingleObjectSchema,
  hast: ArrayOrSingleObjectSchema,
  css: ArrayOrSingleObjectSchema,
  onBeforeCreate: ArrayOrSingleObjectSchema,
  anime: ArrayOrSingleObjectSchema,
  onCreated: ArrayOrSingleObjectSchema,
  onBeforeBegin: ArrayOrSingleObjectSchema,
  onCompleted: ArrayOrSingleObjectSchema,
  onBeforeDestroy: ArrayOrSingleObjectSchema,
  onDestroyed: ArrayOrSingleObjectSchema
}).partial().strict()

const ExtendableAnimateSchema = AnimateSchema.extend({
  onBeforeExtend: ArrayOrSingleObjectSchema,
  extends: ArrayOrSingleObjectSchema
}).partial().strict()

export default ExtendableAnimateSchema
