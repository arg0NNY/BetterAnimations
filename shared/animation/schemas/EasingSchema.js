import { z } from 'zod'
import { EasingBezier, EasingStyle, EasingType } from '@/enums/Easing'
import { easingValues } from '@/data/easings'
import { SourceMappedObjectSchema } from '@animation/sourceMap'

const EasingBaseSchema = type => SourceMappedObjectSchema.extend({
  type: z.literal(type)
}).strict()

const EasingValueSchema = options => {
  let schema = z.number()
  if (!options.fractionDigits) schema = schema.int()
  if ('min' in options) schema = schema.min(options.min)
  if ('max' in options) schema = schema.max(options.max)
  schema = schema.optional()
  if ('default' in options) schema = schema.default(options.default)
  return schema
}

export const EasingLinearSchema = EasingBaseSchema(EasingType.Linear)

export const EasingEaseSchema = EasingBaseSchema(EasingType.Ease).extend({
  bezier: z.enum(EasingBezier.values()).optional().default(EasingBezier.InOut),
  style: z.enum(EasingStyle.values()).optional().default(EasingStyle.Sine)
})

export const EasingBackSchema = EasingBaseSchema(EasingType.Back).extend({
  bezier: z.enum(EasingBezier.values()).optional().default(EasingBezier.Out),
  overshoot: EasingValueSchema(easingValues[EasingType.Back]['overshoot'])
})

export const EasingElasticSchema = EasingBaseSchema(EasingType.Elastic).extend({
  bezier: z.enum(EasingBezier.values()).optional().default(EasingBezier.Out),
  amplitude: EasingValueSchema(easingValues[EasingType.Elastic]['amplitude']),
  period: EasingValueSchema(easingValues[EasingType.Elastic]['period'])
})

export const EasingStepsSchema = EasingBaseSchema(EasingType.Steps).extend({
  amount: EasingValueSchema(easingValues[EasingType.Steps]['amount'])
})

const EasingSchema = z.discriminatedUnion('type', [
  EasingLinearSchema,
  EasingEaseSchema,
  EasingBackSchema,
  EasingElasticSchema,
  EasingStepsSchema
])

export default EasingSchema
