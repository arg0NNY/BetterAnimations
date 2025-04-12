import { z } from 'zod'
import { animate, createTimeline, createTimer } from 'animejs'
import { ArrayOrSingleSchema } from '@/utils/schemas'
import { zodTransformErrorBoundary } from '@/utils/zod'
import TrustedFunctionSchema from '@/modules/animation/schemas/TrustedFunctionSchema'
import { clearSourceMapDeep, SourceMappedObjectSchema } from '@/modules/animation/sourceMap'
import { ParametersSchema } from '@/modules/animation/schemas/utils'

const AnimeBaseSchema = (type, isDefault = false) => SourceMappedObjectSchema.extend({
  type: isDefault ? z.literal(type).optional() : z.literal(type)
}).strict()

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

// Timer
const AnimeTimerSchema = AnimeBaseSchema('timer').extend({
  parameters: ParametersSchema
})

// Animation
const AnimeAnimationSchema = context => AnimeBaseSchema('animation', true).extend({
  targets: AnimeTargetsSchema(context),
  parameters: ParametersSchema
})

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
  parameters: ParametersSchema.optional(),
  children: z.array(AnimeTimelineChildSchema(context)).nonempty()
})

// Instance
const AnimeInstanceSchema = context => z.discriminatedUnion('type', [
  AnimeTimerSchema,
  AnimeAnimationSchema(context),
  AnimeTimelineSchema(context)
]).transform(
  zodTransformErrorBoundary(({ type, targets, parameters, children }) => {
    switch (type) {
      case 'timer':
        return createTimer(
          clearSourceMapDeep(parameters)
        )
      case 'timeline': {
        const tl = createTimeline(
          clearSourceMapDeep(parameters)
        )
        clearSourceMapDeep(children).forEach(child => {
          switch (child.type) {
            case 'set': return tl.set(child.targets, child.parameters, child.position)
            case 'label': return tl.label(child.name, child.position)
            case 'call': return tl.call(child.callback, child.position)
            default:
              return tl.add(
                ...(child.targets ? [child.targets] : []).concat([child.parameters, child.position])
              )
          }
        })
        return tl
      }
      default:
        return animate(
          targets,
          clearSourceMapDeep(parameters)
        )
    }
  })
)

const AnimeSchema = context => ArrayOrSingleSchema(
  AnimeInstanceSchema(context).nullable()
).transform(instances => [].concat(instances).filter(i => i != null))
  .refine(
    instances => instances.length > 0,
    { message: 'No anime instances received' }
  )

export default AnimeSchema
