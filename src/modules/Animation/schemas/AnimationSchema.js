import { z } from 'zod'
import InjectableSchema from '@/modules/Animation/schemas/InjectableSchema'
import { matchesSchema } from '@/helpers/schemas'
import Inject from '@/enums/Inject'
import Setting from '@/enums/AnimationSetting'

const safeInjects = [
  Inject.Variant,
  Inject.Type,
  Inject.Position,
  Inject.Align,
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

const AnimationSchema = (context = null) => z.object({
  name: z.string().trim(),
  settings: z.object({
    [Setting.Duration]: z.object({
      from: z.number().int().nonnegative(),
      to: z.number().int().nonnegative(),
      step: z.number().int().nonnegative(),
    }),
    [Setting.Easing]: z.union([z.literal(true), z.string().array()]),
    [Setting.Variant]: z.object({
      key: z.string(),
      name: z.string()
    }).array(),
    [Setting.Position]: z.literal(true),
    [Setting.Align]: z.literal(true),
    [Setting.Direction]: z.union([z.literal(true), z.string().array()])
  }).partial().strict().optional(),
  animate: AnimateSchema(context).optional(),
  enter: AnimateSchema(context, { disallowed: [Inject.Type] }).optional(),
  exit: AnimateSchema(context, { disallowed: [Inject.Type] }).optional(),
}).strict().refine(
  v => v.animate ? !(v.enter || v.exit) : (v.enter && v.exit),
  { message: `Animation definition is required and must be either inside a single 'animate' property or inside 'enter' and 'exit' properties` }
)

export default AnimationSchema
