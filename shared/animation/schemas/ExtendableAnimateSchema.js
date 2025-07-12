import { z } from 'zod'
import { ArrayOrSingleSchema } from '@utils/schemas'
import { SourceMappedObjectSchema } from '@animation/sourceMap'

const AnimatePropertySchema = ArrayOrSingleSchema(
  ArrayOrSingleSchema(
    z.record(z.string(), z.any()).nullable()
  )
)

export const AnimateSchema = SourceMappedObjectSchema.extend({
  onBeforeLayout: AnimatePropertySchema,
  hast: AnimatePropertySchema,
  css: AnimatePropertySchema,
  onBeforeCreate: AnimatePropertySchema,
  anime: AnimatePropertySchema,
  onCreated: AnimatePropertySchema,
  onBeforeBegin: AnimatePropertySchema,
  onCompleted: AnimatePropertySchema,
  onBeforeDestroy: AnimatePropertySchema,
  onDestroyed: AnimatePropertySchema
}).partial().strict()

const ExtendableAnimateSchema = AnimateSchema.extend({
  onBeforeExtend: AnimatePropertySchema,
  extends: AnimatePropertySchema
}).partial().strict()

export default ExtendableAnimateSchema
