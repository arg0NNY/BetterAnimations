import { z, ZodError } from 'zod'
import InjectableSchema from '@/modules/animation/schemas/InjectableSchema'
import { ArrayOrSingleSchema } from '@/helpers/schemas'
import Inject from '@/enums/Inject'
import SettingsSchema from '@/modules/animation/schemas/SettingsSchema'
import MetaSchema from '@/modules/animation/schemas/MetaSchema'
import ParseStage from '@/enums/ParseStage'
import { defaultSchema, sanitize } from 'hast-util-sanitize'
import { toDom } from 'hast-util-to-dom'
import deepmerge from 'deepmerge'
import { executeWithZod } from '@/modules/animation/utils'
import { hookSymbol } from '@/modules/animation/schemas/SanitizeInjectableSchema'
import { animeTimelineInjectSymbol } from '@/modules/animation/schemas/injects/anime'
import AnimationType from '@/enums/AnimationType'

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
  // If parsing on load or on initialize stage, expect an unparsed data
  if (!env.stage || env.stage === ParseStage.Initialize || !context)
    return !context ? z.any() : InjectableSchema(context, env)

  // Otherwise, expect a lazy inject, which turned into a generator function, awaiting a complete context
  return InjectableSchema(context, env)
    .pipe(ArrayOrSingleSchema(z.function()))
    .transform((value, ctx) => {
      const hook = () => executeWithZod(value, (value, ctx) => {
          [].concat(value).forEach((fn, i) => {
            try { fn() }
            catch (error) {
              if (error instanceof ZodError) throw error
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: error.message,
                path: Array.isArray(value) ? [i] : [],
                params: { error, received: fn }
              })
            }
          })
        }, context, ctx)
      hook[hookSymbol] = true
      return hook
    })
}

const sanitizeSchema = deepmerge(defaultSchema, { attributes: {'*': ['className']} })
export const HastSchema = (context = null, env = {}) =>
  (!context ? z.any() : InjectableSchema(context, env))
    .pipe(ArrayOrSingleSchema(z.record(z.any())))
    .optional()
    .transform(!context || env.stage !== ParseStage.Layout
      ? v => v
      : (value, ctx) => {
        if (!value) return value

        return [].concat(value).map((node, i) => {
          const sanitized = sanitize(node, sanitizeSchema)
          if (sanitized.type === 'root') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Invalid or forbidden hast node',
              path: Array.isArray(value) ? [i] : [],
              params: { received: node }
            })
            return z.NEVER
          }

          return toDom(sanitized)
        })
      })

export const CssSchema = (context = null, env = {}) =>
  z.record(z.record(z.any()))
    .pipe(!context ? z.any() : InjectableSchema(context, env))
    .optional()

export const AnimeSchema = (context = null, env = {}) =>
  (!context ? z.any() : InjectableSchema(context, env))
    .pipe(
      ArrayOrSingleSchema(
        z.union([
          z.record(z.any()),
          z.instanceof(Function).refine(
            fn => fn[animeTimelineInjectSymbol] === true,
            { message: `Only '${Inject.AnimeTimeline}' is allowed as a function` }
          )
        ]).nullable().optional()
      )
    )

export const AnimateSchema = (context = null, env = {}) => {
  const layoutContext = context
  const layoutEnv = Object.assign({ allowed: safeInjects }, env)

  context = env.stage === ParseStage.Layout ? null : context

  return z.object({
    hast: env.stage === ParseStage.Execute ? z.any() : HastSchema(layoutContext, layoutEnv),
    css: env.stage === ParseStage.Execute ? z.any() : CssSchema(layoutContext, layoutEnv),
    anime: AnimeSchema(context, env),
    onBeforeCreate: HookSchema(context, env).optional(),
    onCreated: HookSchema(context, env).optional(),
    onBeforeBegin: HookSchema(context, env).optional(),
    onCompleted: HookSchema(context, env).optional(),
    onBeforeDestroy: HookSchema(context, env).optional(),
    onDestroyed: HookSchema(context, env).optional(),
  }).strict()
}

export default AnimateSchema
