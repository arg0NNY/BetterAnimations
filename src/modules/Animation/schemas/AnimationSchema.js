import { z } from 'zod'
import InjectableSchema from '@/modules/Animation/schemas/InjectableSchema'
import { matchesSchema } from '@/helpers/schemas'

const safeInjects = ['variant', 'type', 'position', 'align', 'Object.assign', 'string.template', 'math', 'anime.random']

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
    duration: z.object({
      from: z.number().int().nonnegative(),
      to: z.number().int().nonnegative(),
      step: z.number().int().nonnegative(),
    }),
    easing: z.union([z.literal(true), z.string().array()]),
    variant: z.object({
      key: z.string(),
      name: z.string()
    }).array(),
    position: z.literal(true),
    align: z.literal(true)
  }).partial().strict().optional(),
  animate: AnimateSchema(context).optional(),
  enter: AnimateSchema(context, { disallowed: ['type'] }).optional(),
  exit: AnimateSchema(context, { disallowed: ['type'] }).optional(),
}).strict().refine(
  v => v.animate ? !(v.enter || v.exit) : (v.enter && v.exit),
  { message: `Animation definition is required and must be either inside a single 'animate' property or inside 'enter' and 'exit' properties` }
)

export default AnimationSchema
