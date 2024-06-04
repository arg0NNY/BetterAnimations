import { z } from 'zod'
import InjectableSchema from '@/modules/animation/schemas/InjectableSchema'
import { ArrayOrSingleSchema, matchesSchema } from '@/helpers/schemas'
import Inject from '@/enums/Inject'
import SettingsSchema from '@/modules/animation/schemas/SettingsSchema'
import MetaSchema from '@/modules/animation/schemas/MetaSchema'
import ParseStage from '@/enums/ParseStage'

// TODO: Update
const safeInjects = [
  Inject.Module,
  Inject.Type,
  Inject.Variant,
  Inject.Position,
  Inject.Direction,
  Inject.ObjectAssign,
  Inject.StringTemplate,
  Inject.Math,
  Inject.AnimeRandom
]

export const HookSchema = (context = null, env = {}) => {
  // If parsing on load or on initialize stage, expect an unparsed object
  if (!env.stage || env.stage === ParseStage.Initialize)
    return ArrayOrSingleSchema(z.record(z.any()))
      .transform(!context ? v => v : matchesSchema(
        InjectableSchema(context, env)
      ))

  // Otherwise, expect a lazy inject, which turned into a generator function, awaiting a complete context
  if (!context) return ArrayOrSingleSchema(z.function())

  return ArrayOrSingleSchema(z.function())
    .transform(matchesSchema(
      InjectableSchema(context, env)
    ))
    .transform(
      v => Array.isArray(v)
        ? () => v.forEach(f => f())
        : v
    )
}

export const AnimateSchema = (context = null, env = {}) => {
  const layoutContext = context
  const layoutEnv = Object.assign({ allowed: safeInjects }, env)

  context = env.stage === ParseStage.Layout ? null : context

  return z.object({
    hast: ArrayOrSingleSchema(z.record(z.any()))
      .transform(!layoutContext ? v => v : matchesSchema(
        InjectableSchema(layoutContext, layoutEnv)
      )).optional(),
    css: z.record(z.record(z.any()))
      .transform(!layoutContext ? v => v : matchesSchema(
        InjectableSchema(layoutContext, layoutEnv)
      )).optional(),
    anime: ArrayOrSingleSchema(z.record(z.any()))
      .transform(!context ? v => v : matchesSchema(
        InjectableSchema(context, env)
      )),
    onBeforeCreate: HookSchema(context, env).optional(),
    onCreated: HookSchema(context, env).optional(),
    onBeforeBegin: HookSchema(context, env).optional(),
    onCompleted: HookSchema(context, env).optional(),
    onBeforeDestroy: HookSchema(context, env).optional(),
    onDestroyed: HookSchema(context, env).optional(),
  }).strict()
}

const AnimationSchema = z.object({
  key: z.string().min(1).trim(),
  name: z.string().trim(),
  meta: MetaSchema.optional().default({}),
  settings: SettingsSchema.optional(),
  animate: AnimateSchema().optional(),
  enter: AnimateSchema().optional(),
  exit: AnimateSchema().optional(),
}).strict().refine(
  v => v.animate ? !(v.enter || v.exit) : (v.enter && v.exit),
  { message: `Animation definition is required and must be either inside a single 'animate' property or inside 'enter' and 'exit' properties` }
)

export default AnimationSchema
