import {
  InjectSchema,
  InjectWithMeta,
  ParametersSchema,
  TargetSchema,
  TargetsSchema
} from '@animation/schemas/utils'
import { stagger, svg, utils } from 'animejs'
import { z } from 'zod'
import Inject from '@shared/enums/Inject'
import { zodTransformErrorBoundary } from '@utils/zod'
import { zodErrorBoundary } from '@animation/utils'
import { clearSourceMapDeep } from '@animation/sourceMap'

const StaggerValueSchema = z.union([z.number(), z.string()])
export const StaggerInjectSchema = context => InjectSchema(Inject.Stagger).extend({
  value: z.union([
    StaggerValueSchema,
    z.tuple([StaggerValueSchema, StaggerValueSchema])
  ]),
  parameters: ParametersSchema.optional()
}).transform(
  zodTransformErrorBoundary(({ value, parameters }, { path }) => {
    value = clearSourceMapDeep(value)
    parameters = clearSourceMapDeep(parameters)
    return zodErrorBoundary(
      stagger(value, parameters),
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

export const UtilsGetInjectSchema = context => InjectSchema(Inject.UtilsGet).extend({
  target: TargetSchema(context).optional().default(context.element),
  property: z.string(),
  unit: z.union([z.string(), z.boolean()]).optional()
}).transform(
  zodTransformErrorBoundary(
    ({ target, property, unit }) => utils.get(target, property, unit)
  )
)

export const UtilsSetInjectSchema = InjectWithMeta(
  context => InjectSchema(Inject.UtilsSet).extend({
    targets: TargetsSchema(context).optional().default([context.element]),
    properties: ParametersSchema
  }).transform(
    zodTransformErrorBoundary(
      ({ targets, properties }, { path }) => {
        const instance = utils.set(
          targets,
          clearSourceMapDeep(properties)
        )
        return zodErrorBoundary(
          instance.revert.bind(instance),
          context,
          { path, name: 'revert' }
        )
      }
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

export const SvgCreateDrawableInjectSchema = context => InjectSchema(Inject.SvgCreateDrawable).extend({
  targets: TargetsSchema(context)
}).transform(
  zodTransformErrorBoundary(
    ({ targets }) => targets.flatMap(target => svg.createDrawable(target))
  )
)

export const SvgCreateMotionPathInjectSchema = context => InjectSchema(Inject.SvgCreateMotionPath).extend({
  target: TargetSchema(context)
}).transform(
  zodTransformErrorBoundary(
    ({ target }, { path }) => {
      const { translateX, translateY, rotate } = svg.createMotionPath(target)
      const boundary = fn => zodErrorBoundary(fn, context, { path, name: 'svg.createMotionPath' })
      return {
        translateX: boundary(translateX),
        translateY: boundary(translateY),
        rotate: boundary(rotate)
      }
    }
  )
)
