import { z } from 'zod'
import InjectableSchema from '@/modules/Animation/schemas/InjectableSchema'
import { matchesSchema } from '@/helpers/schemas'
import Inject from '@/enums/Inject'
import SettingsSchema from '@/modules/Animation/schemas/SettingsSchema'

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
    hast: z.union([z.record(z.any()), z.record(z.any()).array()])
      .transform(!context ? v => v : matchesSchema(
        InjectableSchema(context, restrictedInjectOptions)
      )).optional(),
    css: z.record(z.record(z.any()))
      .transform(!context ? v => v : matchesSchema(
        InjectableSchema(context, restrictedInjectOptions)
      )).optional(),
    anime: z.union([z.record(z.any()), z.record(z.any()).array()])
      .transform(!context ? v => v : matchesSchema(
        InjectableSchema(context, injectOptions)
      ))
  })
}

// TODO: Allow restricting animations to certain modules
const AnimationSchema = (context = null) => z.object({
  key: z.string().min(1).trim(),
  name: z.string().trim(),
  settings: SettingsSchema.optional(),
  animate: AnimateSchema(context).optional(),
  enter: AnimateSchema(context, { disallowed: [Inject.Type] }).optional(),
  exit: AnimateSchema(context, { disallowed: [Inject.Type] }).optional(),
}).strict().refine(
  v => v.animate ? !(v.enter || v.exit) : (v.enter && v.exit),
  { message: `Animation definition is required and must be either inside a single 'animate' property or inside 'enter' and 'exit' properties` }
)

export default AnimationSchema
