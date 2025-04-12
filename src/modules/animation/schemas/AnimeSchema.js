import { z } from 'zod'
import { animate, createTimeline, createTimer } from 'animejs'
import { ArrayOrSingleSchema } from '@/utils/schemas'
import { zodTransformErrorBoundary } from '@/utils/zod'
import TrustedFunctionSchema from '@/modules/animation/schemas/TrustedFunctionSchema'
import { InjectableValidateSchema } from '@/modules/animation/schemas/InjectableSchema'
import { clearSourceMapDeep } from '@/modules/animation/sourceMap'

// Targets
const AnimeTargetSchema = z.union([
  z.string(),
  z.instanceof(Element)
])
const AnimeTargetsSchema = context => ArrayOrSingleSchema(
  AnimeTargetSchema.nullable()
    .transform((target, ctx) => {
      if (target == null) return null
      if (typeof target === 'string') {
        if (!context.wrapper) return null
        try {
          return context.wrapper.querySelectorAll(target)
        }
        catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Invalid selector: '${target}'`,
            params: { received: target }
          })
          return z.NEVER
        }
      }
      return target
    })
).transform(targets => [].concat(targets).filter(t => t != null))
  .refine(
    targets => targets.length > 0,
    { message: 'No targets specified' }
  )

// Utilities
const AnimeBaseSchema = (type, isDefault = false) => z.strictObject({
  type: isDefault ? z.literal(type).optional() : z.literal(type)
})
const ParametersSchema = z.record(z.string(), z.any())
  .superRefine((value, ctx) => {
    const { success } = InjectableValidateSchema.safeParse(value)
    if (!success) ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Illegal value',
      params: { received: value }
    })
  })

// Timer
const AnimeTimerSchema = AnimeBaseSchema('timer').extend({
  parameters: ParametersSchema
}).transform(
  zodTransformErrorBoundary(
    ({ parameters }) => createTimer(
      clearSourceMapDeep(parameters)
    )
  )
)

// Animation
const AnimeAnimationSchema = context => AnimeBaseSchema('animation', true).extend({
  targets: AnimeTargetsSchema(context),
  parameters: ParametersSchema
}).transform(
  zodTransformErrorBoundary(
    ({ targets, parameters }) => animate(
      targets,
      clearSourceMapDeep(parameters)
    )
  )
)

// Timeline
const AnimeTimelineChildBaseSchema = (type, isDefault = false) => AnimeBaseSchema(type, isDefault).extend({
  position: z.union([
    z.number(),
    z.string(),
    TrustedFunctionSchema
  ]).optional()
})
const AnimeTimelineAddChildSchema = context => AnimeTimelineChildBaseSchema('add', true).extend({
  targets: AnimeTargetsSchema(context).optional(),
  parameters: ParametersSchema
})
const AnimeTimelineSetChildSchema = context => AnimeTimelineChildBaseSchema('set').extend({
  targets: AnimeTargetsSchema(context),
  parameters: ParametersSchema
})
const AnimeTimelineLabelChildSchema = AnimeTimelineChildBaseSchema('label').extend({
  name: z.string()
})
const AnimeTimelineCallChildSchema = AnimeTimelineChildBaseSchema('call').extend({
  callback: TrustedFunctionSchema
})
const AnimeTimelineChildSchema = context => z.discriminatedUnion('type', [
  AnimeTimelineAddChildSchema(context),
  AnimeTimelineSetChildSchema(context),
  AnimeTimelineLabelChildSchema,
  AnimeTimelineCallChildSchema
])
const AnimeTimelineSchema = context => AnimeBaseSchema('timeline').extend({
  parameters: ParametersSchema,
  children: z.array(AnimeTimelineChildSchema(context)).nonempty()
}).transform(
  zodTransformErrorBoundary(({ parameters, children }) => {
    const tl = createTimeline(
      clearSourceMapDeep(parameters)
    )
    clearSourceMapDeep(children).forEach(child => {
      switch (child.type) {
        case 'add': return tl.add(
          ...(child.targets ? [child.targets] : []).concat([child.parameters, child.position])
        )
        case 'set': return tl.set(child.targets, child.parameters, child.position)
        case 'label': return tl.label(child.name, child.position)
        case 'call': return tl.call(child.callback, child.position)
      }
    })
    return tl
  })
)

// Instance
const AnimeInstanceSchema = context => z.discriminatedUnion('type', [
  AnimeTimerSchema,
  AnimeAnimationSchema(context),
  AnimeTimelineSchema(context)
])

const AnimeSchema = context => ArrayOrSingleSchema(
  AnimeInstanceSchema(context).nullable()
).transform(instances => [].concat(instances).filter(i => i != null))
  .refine(
    instances => instances.length > 0,
    { message: 'No anime instances received' }
  )

export default AnimeSchema
