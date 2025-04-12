import { ArrayOrSingleSchema, Defined } from '@/utils/schemas'
import { InjectSchema, InjectWithMeta } from '@/modules/animation/schemas/utils'
import anime from 'animejs'
import * as z from 'zod'
import Inject from '@/enums/Inject'
import { zodTransformErrorBoundary } from '@/utils/zod'
import { transformAnimeConfig, zodErrorBoundary } from '@/modules/animation/utils'
import { clearSourceMapDeep, SourceMappedObjectSchema } from '@/modules/animation/sourceMap'
import { trust } from '@/modules/animation/schemas/TrustedFunctionSchema'

export const AnimeStaggerInjectSchema = context => InjectSchema(Inject.AnimeStagger).extend({
  value: Defined,
  options: Defined.optional()
}).transform(
  zodTransformErrorBoundary(({ value, options }, ctx) =>
    zodErrorBoundary(
      anime.stagger(clearSourceMapDeep(value), clearSourceMapDeep(options)),
      context,
      { path: ctx.path, name: 'anime.stagger' }
    )
  )
)

export const animeTimelineInjectSymbol = Symbol('animeTimelineInject')
export const AnimeTimelineInjectSchema = InjectWithMeta(
  InjectSchema(Inject.AnimeTimeline).extend({
    parameters: Defined.optional(),
    children: SourceMappedObjectSchema.extend({
      parameters: Defined,
      offset: Defined.optional()
    }).array().optional()
  }).transform(params => {
    params = clearSourceMapDeep(params)
    const fn = (...args) => {
      const tl = anime.timeline(
        params.parameters && transformAnimeConfig(params.parameters, ...args)
      )
      params.children?.forEach(p => tl.add(
        transformAnimeConfig(p.parameters, ...args),
        p.offset
      ))
      return tl
    }
    fn[animeTimelineInjectSymbol] = params
    return trust(fn)
  }),
  {
    allowed: ({ context, ctx }) => {
      const path = ctx.path.slice(context.path.length)
      return path.length <= 2
        && path[0] === 'anime'
        && ['number', 'undefined'].includes(typeof path[1])
    }
  }
)

export const AnimeRandomInjectSchema = InjectSchema(Inject.AnimeRandom).extend({
  min: z.number(),
  max: z.number()
}).transform(
  zodTransformErrorBoundary(params => anime.random(params.min, params.max))
)

export const AnimeGetInjectSchema = ({ element }) => InjectSchema(Inject.AnimeGet).extend({
  target: z.instanceof(Element).optional().default(element),
  property: z.string(),
  unit: z.union([z.string(), z.literal(false)]).optional()
}).transform(
  zodTransformErrorBoundary(({ target, property, unit }) => {
    const value = anime.get(target, property, unit)
    return unit === false ? Number.parseInt(value) : value
  })
)

export const AnimeSetInjectSchema = InjectWithMeta(
  ({ element }) => InjectSchema(Inject.AnimeSet).extend({
    target: ArrayOrSingleSchema(z.instanceof(Element)).optional().default(element),
    properties: z.record(z.string(), z.any())
  }).transform(
    zodTransformErrorBoundary(({ target, properties }) => anime.set(
      target,
      clearSourceMapDeep(properties)
    ))
  ),
  { lazy: true }
)

export const AnimePathInjectSchema = context => InjectSchema(Inject.AnimePath).extend({
  path: z.instanceof(SVGElement),
  property: z.string().optional()
}).transform(
  zodTransformErrorBoundary(({ path, property }, ctx) => {
    const fn = anime.path(path)

    if (typeof property === 'string') return fn(property)
    return zodErrorBoundary(
      fn,
      context,
      { path: ctx.path, name: 'anime.path' }
    )
  })
)

export const AnimeSetDashoffsetInjectSchema = context => InjectSchema(Inject.AnimeSetDashoffset).transform((_, ctx) =>
  zodErrorBoundary(
    anime.setDashoffset,
    context,
    { path: ctx.path, name: 'anime.setDashoffset' }
  )
)
