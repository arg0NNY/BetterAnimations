import { Defined } from '@/helpers/schemas'
import { InjectSchema } from '@/modules/Animation/schemas/injects/InjectSchema'
import anime from 'animejs'
import { z } from 'zod'

export const AnimeStaggerInjectSchema = InjectSchema('anime.stagger').extend({
  value: Defined,
  options: Defined.optional()
}).transform(params => anime.stagger(params.value, params.options))

export const AnimeTimelineInjectSchema = InjectSchema('anime.timeline').extend({
  parameters: Defined,
  children: z.object({
    parameters: Defined,
    offset: Defined.optional()
  }).array().optional()
}).transform(params => {
  const tl = anime.timeline(params.parameters)
  params.children?.forEach(p => tl.add(p.parameters, p.offset))
  return tl
})
