import { z } from 'zod'
import InjectableSchema from '@/modules/animation/schemas/InjectableSchema'
import { ArrayOrSingleSchema, matchesSchema } from '@/helpers/schemas'
import Inject from '@/enums/Inject'
import SettingsSchema from '@/modules/animation/schemas/SettingsSchema'
import MetaSchema from '@/modules/animation/schemas/MetaSchema'

const safeInjects = [
  Inject.Variant,
  Inject.Type,
  Inject.Position,
  Inject.Direction,
  Inject.ObjectAssign,
  Inject.StringTemplate,
  Inject.Math,
  Inject.AnimeRandom
]

export const AnimateSchema = (context = null, injectOptions = {}) => {
  const restrictedInjectOptions = Object.assign({ allowed: safeInjects }, injectOptions)

  return z.object({
    hast: ArrayOrSingleSchema(z.record(z.any()))
      .transform(!context ? v => v : matchesSchema(
        InjectableSchema(context, restrictedInjectOptions)
      )).optional(),
    css: z.record(z.record(z.any()))
      .transform(!context ? v => v : matchesSchema(
        InjectableSchema(context, restrictedInjectOptions)
      )).optional(),
    anime: ArrayOrSingleSchema(z.record(z.any()))
      .transform(!context ? v => v : matchesSchema(
        InjectableSchema(context, injectOptions)
      ))
  })
}

const AnimationSchema = (context = null) => z.object({
  key: z.string().min(1).trim(),
  name: z.string().trim(),
  meta: MetaSchema.optional(),
  settings: SettingsSchema.optional(),
  animate: AnimateSchema(context).optional(),
  enter: AnimateSchema(context, { disallowed: [Inject.Type] }).optional(),
  exit: AnimateSchema(context, { disallowed: [Inject.Type] }).optional(),
}).strict().refine(
  v => v.animate ? !(v.enter || v.exit) : (v.enter && v.exit),
  { message: `Animation definition is required and must be either inside a single 'animate' property or inside 'enter' and 'exit' properties` }
)

export default AnimationSchema
