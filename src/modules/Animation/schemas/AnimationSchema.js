import { z } from 'zod'
import InjectableSchema from '@/modules/Animation/schemas/InjectableSchema'
import { matchesSchema } from '@/helpers/schemas'

const safeInjects = ['variant', 'type', 'Object.assign']

const AnimateSchema = context => z.object({
  hast: InjectableSchema(context, safeInjects).optional()
    .transform(matchesSchema(
      z.union([z.record(z.any()), z.record(z.any()).array()])
    )),
  css: InjectableSchema(context, safeInjects).optional()
    .transform(matchesSchema(
      z.record(z.record(z.any()))
    )),
  anime: InjectableSchema(context),
})

const AnimationSchema = context => z.object({
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
    }).array()
  }).partial().optional(),
  animate: AnimateSchema(context).optional(),
  enter: AnimateSchema(context).optional(),
  exit: AnimateSchema(context).optional(),
}).strict().refine(
  v => v.animate ? !(v.enter || v.exit) : (v.enter && v.exit),
  { message: `Animation definition is required and must be either inside a single 'animate' property or inside 'enter' and 'exit' properties` }
)

export default AnimationSchema
