import * as z from 'zod'
import { EasingBezier, EasingStyle, EasingType } from '@/enums/Easing'
import { easingValues } from '@/data/easings'
import { SourceMappedObjectSchema } from '@/modules/animation/sourceMap'

const EasingBaseSchema = type => SourceMappedObjectSchema.extend(
  z.strictObject({
    type: z.literal(type)
  })
)

const EasingValueSchema = options => {
  let schema = z.number()
  if ('min' in options) schema = schema.min(options.min)
  if ('max' in options) schema = schema.max(options.max)
  if ('step' in options) schema = schema.multipleOf(options.step)
  schema = schema.optional()
  if ('default' in options) schema = schema.default(options.default)
  return schema
}

export const EasingLinearSchema = EasingBaseSchema(EasingType.Linear)

export const EasingEaseSchema = EasingBaseSchema(EasingType.Ease).extend({
  bezier: z.enum(EasingBezier.values()).optional().default(EasingBezier.InOut),
  style: z.enum(EasingStyle.values()).optional().default(EasingStyle.Sine)
})

export const EasingSpringSchema = EasingBaseSchema(EasingType.Spring).extend({
  mass: EasingValueSchema(easingValues[EasingType.Spring]['mass']),
  stiffness: EasingValueSchema(easingValues[EasingType.Spring]['stiffness']),
  damping: EasingValueSchema(easingValues[EasingType.Spring]['damping']),
  velocity: EasingValueSchema(easingValues[EasingType.Spring]['velocity']),
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
  EasingSpringSchema,
  EasingElasticSchema,
  EasingStepsSchema
])

export default EasingSchema
