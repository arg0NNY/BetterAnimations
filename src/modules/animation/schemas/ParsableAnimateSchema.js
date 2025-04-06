import { z, ZodError } from 'zod'
import InjectableSchema from '@/modules/animation/schemas/InjectableSchema'
import { ArrayOrSingleSchema, parseInjectSchemas } from '@/utils/schemas'
import Inject from '@/enums/Inject'
import ParseStage from '@/enums/ParseStage'
import { sanitize } from 'hast-util-sanitize'
import { toDom } from 'hast-util-to-dom'
import { executeWithZod } from '@/modules/animation/utils'
import { hookSymbol } from '@/modules/animation/schemas/SanitizeInjectableSchema'
import { animeTimelineInjectSymbol } from '@/modules/animation/schemas/injects/anime'
import hastSanitizeSchema from '@/modules/animation/hastSanitizeSchema'
import * as SettingsInjectSchemas from '@/modules/animation/schemas/injects/settings'
import * as MathInjectSchemas from '@/modules/animation/schemas/injects/math'
import * as OperatorsInjectSchemas from '@/modules/animation/schemas/injects/operators'

const safeInjects = [
  ...Object.keys(parseInjectSchemas(SettingsInjectSchemas)),
  ...Object.keys(parseInjectSchemas(MathInjectSchemas)),
  ...Object.keys(parseInjectSchemas(OperatorsInjectSchemas)),
  // Anime
  Inject.AnimeRandom,
  Inject.AnimeGet,
  // Common
  Inject.Element,
  Inject.Hast,
  Inject.Container,
  Inject.Anchor,
  Inject.Module,
  Inject.ModuleType,
  Inject.Type,
  Inject.ObjectAssign,
  Inject.StringTemplate,
  Inject.Math,
  Inject.Undefined,
  Inject.VarGet,
  Inject.GetBoundingClientRect,
  Inject.Mouse,
  Inject.IsIntersected,
  Inject.If,
  Inject.Switch
]

const executeOnlyInjects = [
  Inject.Hast
]

const ParsableSchema = (stage, schema) => (context, env) =>
  (![ParseStage.Initialize, stage].includes(env.stage) ? z.any() : InjectableSchema(context, env))
    .pipe(
      env.stage === stage
        ? (typeof schema === 'function' ? schema(context, env) : schema)
        : z.any()
    )

export const HookSchema = (context, env, stage = ParseStage.Execute) => ParsableSchema(
  stage,
  context => ArrayOrSingleSchema(z.function())
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
    .optional()
)(context, env)

export const HastSchema = ParsableSchema(
  ParseStage.Layout,
  ArrayOrSingleSchema(z.record(z.any()))
    .transform((value, ctx) => {
      return [].concat(value).map((node, i) => {
        const sanitized = sanitize(node, hastSanitizeSchema)
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
    .optional()
)


export const CssSchema = ParsableSchema(
  ParseStage.Layout,
  ArrayOrSingleSchema(
    z.record(z.record(z.any()))
  ).optional()
)

export const AnimeSchema = ParsableSchema(
  ParseStage.Execute,
  ArrayOrSingleSchema(
    z.union([
      z.record(z.any()),
      z.instanceof(Function).refine(
        fn => !!fn[animeTimelineInjectSymbol],
        { message: `Only '${Inject.AnimeTimeline}' is allowed as a function` }
      )
    ]).nullable().optional()
  )
)

export const ParsableAnimateSchema = (context, env) => {
  const beforeCreateEnv = Object.assign({ disallowed: executeOnlyInjects }, env)
  const layoutEnv = Object.assign({ allowed: safeInjects, disallowed: executeOnlyInjects }, env)

  return z.object({
    onBeforeCreate: HookSchema(context, beforeCreateEnv, ParseStage.BeforeCreate),
    hast: HastSchema(context, layoutEnv),
    css: CssSchema(context, layoutEnv),
    anime: AnimeSchema(context, env),
    onCreated: HookSchema(context, env),
    onBeforeBegin: HookSchema(context, env),
    onCompleted: HookSchema(context, env),
    onBeforeDestroy: HookSchema(context, env),
    onDestroyed: HookSchema(context, env),
  }).strict()
}

export default ParsableAnimateSchema
