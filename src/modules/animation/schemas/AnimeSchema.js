import { z } from 'zod'
import { animate, createTimeline, createTimer } from 'animejs'
import { ArrayOrSingleSchema } from '@/utils/schemas'
import { zodTransformErrorBoundary } from '@/utils/zod'
import TrustedFunctionSchema from '@/modules/animation/schemas/TrustedFunctionSchema'
import { clearSourceMapDeep, SourceMappedObjectSchema } from '@/modules/animation/sourceMap'
import { ParametersSchema, TargetsSchema } from '@/modules/animation/schemas/utils'
import { apply } from '@/utils/anime'

const AnimeBaseSchema = (type, isDefault = false) => SourceMappedObjectSchema.extend({
  type: isDefault ? z.literal(type).optional() : z.literal(type)
}).strict()

// Timer
const AnimeTimerSchema = AnimeBaseSchema('timer').extend({
  parameters: ParametersSchema
})

// Animation
const AnimeAnimationSchema = context => AnimeBaseSchema('animation', true).extend({
  targets: TargetsSchema(context),
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
  targets: TargetsSchema(context).optional(),
  parameters: ParametersSchema
})
const AnimeTimelineSetChildSchema = context => AnimeTimelineChildBaseSchema('set').extend({
  targets: TargetsSchema(context),
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
function buildInstance ({ type, targets, parameters, children }) {
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
}
const AnimeInstanceSchema = context => z.discriminatedUnion('type', [
  AnimeTimerSchema,
  AnimeAnimationSchema(context),
  AnimeTimelineSchema(context)
]).transform(
  zodTransformErrorBoundary(
    options => apply(
      buildInstance(options),
      {
        awaitFrame: true,
        intersectWith: context.intersectWith
      }
    )
  )
)

const AnimeSchema = context => ArrayOrSingleSchema(
  AnimeInstanceSchema(context).nullable()
).transform(instances => [].concat(instances).filter(i => i != null))
  .refine(
    instances => instances.length > 0,
    { message: 'No anime instances created' }
  )

export default AnimeSchema
