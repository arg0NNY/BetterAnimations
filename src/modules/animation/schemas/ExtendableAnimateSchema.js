import * as z from 'zod'
import { ArrayOrSingleSchema } from '@/utils/schemas'
import { SourceMappedObjectSchema } from '@/modules/animation/sourceMap'

const ArrayOrSingleObjectSchema = ArrayOrSingleSchema(z.record(z.any()))

export const AnimateSchema = SourceMappedObjectSchema.extend(
  z.strictObject({
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
  }).partial()
)

const ExtendableAnimateSchema = AnimateSchema.extend(
  z.strictObject({
    onBeforeExtend: ArrayOrSingleObjectSchema,
    extends: ArrayOrSingleObjectSchema
  }).partial()
)

export default ExtendableAnimateSchema
