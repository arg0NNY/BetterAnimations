import { ArrayOrSingleSchema, Defined } from '@/helpers/schemas'
import { InjectSchema, InjectWithMeta } from '@/modules/animation/schemas/utils'
import anime from 'animejs'
import { z } from 'zod'
import { transformAnimeConfig } from '@/modules/animation/helpers'
import Inject from '@/enums/Inject'

export const AnimeStaggerInjectSchema = InjectSchema(Inject.AnimeStagger).extend({
  value: Defined,
  options: Defined.optional()
}).transform(params => anime.stagger(params.value, params.options))

export const AnimeTimelineInjectSchema = InjectSchema(Inject.AnimeTimeline).extend({
  parameters: Defined.optional(),
  children: z.object({
    parameters: Defined,
    offset: Defined.optional()
  }).array().optional()
}).transform(params => (...args) => {
  const tl = anime.timeline(
    params.parameters && transformAnimeConfig(params.parameters, ...args)
  )
  params.children?.forEach(p => tl.add(
    transformAnimeConfig(p.parameters, ...args),
    p.offset
  ))
  return tl
})

export const AnimeRandomInjectSchema = InjectSchema(Inject.AnimeRandom).extend({
  min: z.number(),
  max: z.number()
}).transform(params => anime.random(params.min, params.max))

export const AnimeGetInjectSchema = ({ element }) => InjectSchema(Inject.AnimeGet).extend({
  target: z.instanceof(Element).optional().default(element),
  property: z.string(),
  unit: z.union([z.string(), z.literal(false)]).optional()
}).transform(({ target, property, unit }) => {
  const value = anime.get(target, property, unit)
  return unit === false ? Number.parseInt(value) : value
})

export const AnimeSetInjectSchema = InjectWithMeta(
  ({ element }) => InjectSchema(Inject.AnimeSet).extend({
    target: ArrayOrSingleSchema(z.instanceof(Element)).optional().default(element),
    properties: z.record(z.any())
  }).transform(({ target, properties }) => anime.set(target, properties)),
  { lazy: true }
)

export const AnimePathInjectSchema = InjectSchema(Inject.AnimePath).extend({
  path: z.instanceof(SVGElement),
  property: z.string().optional()
}).transform(({ path, property }) => {
  const fn = anime.path(path)

  if (typeof property === 'string') return fn(property)
  return fn
})

export const AnimeSetDashoffsetInjectSchema = InjectWithMeta(
  InjectSchema(Inject.AnimeSetDashoffset).transform(() => anime.setDashoffset),
  { immediate: true }
)
