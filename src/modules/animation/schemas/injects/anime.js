import { ArrayOrSingleSchema } from '@/utils/schemas'
import { InjectSchema, InjectWithMeta, ParametersSchema, TargetSchema } from '@/modules/animation/schemas/utils'
import { stagger, svg, utils } from 'animejs'
import { z } from 'zod'
import Inject from '@/enums/Inject'
import { zodTransformErrorBoundary } from '@/utils/zod'
import { zodErrorBoundary } from '@/modules/animation/utils'
import { clearSourceMapDeep } from '@/modules/animation/sourceMap'

const StaggerValueSchema = z.union([z.number(), z.string()])
export const StaggerInjectSchema = context => InjectSchema(Inject.Stagger).extend({
  value: z.union([
    StaggerValueSchema,
    z.tuple([StaggerValueSchema, StaggerValueSchema])
  ]),
  parameters: ParametersSchema.optional()
}).transform(
  zodTransformErrorBoundary(({ value, options }, { path }) => {
    value = clearSourceMapDeep(value)
    options = clearSourceMapDeep(options)
    return zodErrorBoundary(
      stagger(value, options),
      context,
      { path, name: 'stagger' }
    )
  })
)

export const UtilsRandomInjectSchema = InjectSchema(Inject.UtilsRandom).extend({
  min: z.number(),
  max: z.number(),
  decimalLength: z.number().optional()
}).transform(
  zodTransformErrorBoundary(
    ({ min, max, decimalLength }) => utils.random(min, max, decimalLength)
  )
)

export const UtilsGetInjectSchema = ({ element }) => InjectSchema(Inject.UtilsGet).extend({
  target: z.instanceof(Element).optional().default(element),
  property: z.string(),
  unit: z.union([z.string(), z.literal(false)]).optional()
}).transform(
  zodTransformErrorBoundary(
    ({ target, property, unit }) => utils.get(target, property, unit)
  )
)

export const UtilsSetInjectSchema = InjectWithMeta(
  ({ element }) => InjectSchema(Inject.UtilsSet).extend({
    target: ArrayOrSingleSchema(z.instanceof(Element)).optional().default(element),
    properties: ParametersSchema
  }).transform(
    zodTransformErrorBoundary(
      ({ target, properties }) => utils.set(
        target,
        clearSourceMapDeep(properties)
      )
    )
  ),
  { lazy: true }
)

export const SvgMorphToInjectSchema = context => InjectSchema(Inject.SvgMorphTo).extend({
  target: TargetSchema(context),
  precision: z.number().min(0).max(1).optional()
}).transform(
  zodTransformErrorBoundary(
    ({ target, precision }, { path }) => zodErrorBoundary(
      svg.morphTo(target, precision),
      context,
      { path, name: 'svg.morphTo' }
    )
  )
)
