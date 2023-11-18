import { Defined } from '@/helpers/schemas'
import { InjectSchema } from '@/modules/Animation/schemas/injects/InjectSchema'
import anime from 'animejs'
import { z } from 'zod'
import { transformAnimeConfig } from '@/modules/Animation/helpers'

export const AnimeStaggerInjectSchema = InjectSchema('anime.stagger').extend({
  value: Defined,
  options: Defined.optional()
}).transform(params => anime.stagger(params.value, params.options))

export const AnimeTimelineInjectSchema = InjectSchema('anime.timeline').extend({
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
