import { z } from 'zod'
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
import { clearSourceMapDeep, SourceMappedObjectSchema } from '@/modules/animation/sourceMap'
import TrustedFunctionSchema from '@/modules/animation/schemas/TrustedFunctionSchema'
import ParsableSchema from '@/modules/animation/schemas/ParsableSchema'
import { InjectableValidateSchema } from '@/modules/animation/schemas/InjectableSchema'

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
  Inject.Assign,
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

const layoutDependentInjects = [
  Inject.Hast
]

export function buildPreLayoutEnv (env) {
  return Object.assign({ disallowed: layoutDependentInjects }, env)
}

export function buildLayoutEnv (env) {
  return Object.assign({ allowed: safeInjects, disallowed: layoutDependentInjects }, env)
}

export const HookSchema = (context, env, stage) => ParsableSchema(
  stage,
  context => ArrayOrSingleSchema(
    TrustedFunctionSchema.nullable()
  ).transform((value, ctx) => {
    const hook = () => executeWithZod(value, (value, ctx) => {
      [].concat(value).forEach((fn, i) => {
        if (!fn) return
        try { fn() }
        catch (error) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: error.message,
            path: Array.isArray(value) ? [i] : [],
            params: { error, received: fn }
          })
        }
      })
    }, context, ctx)
    hook[hookSymbol] = value
    return hook
  }).optional()
)(context, env)

export const HastSchema = ParsableSchema(
  ParseStage.Layout,
  ArrayOrSingleSchema(
    z.record(z.any()).nullable()
  ).transform((value, ctx) => {
    value = clearSourceMapDeep(value)
    return [].concat(value).filter(Boolean).map((node, i) => {
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
  }).optional()
)


export const CssSchema = ParsableSchema(
  ParseStage.Layout,
  ArrayOrSingleSchema(
    z.record(z.record(z.any())).nullable()
  ).optional()
)

export const AnimeSchema = ParsableSchema(
  ParseStage.Anime,
  ArrayOrSingleSchema(
    z.union([
      z.record(z.any()),
      TrustedFunctionSchema.refine(
        fn => !!fn[animeTimelineInjectSymbol],
        { message: `Only '${Inject.AnimeTimeline}' is allowed as a function` }
      )
    ]).nullable()
  ).superRefine((value, ctx) => {
    const { success } = InjectableValidateSchema.safeParse(value)
    if (!success) ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Illegal value',
      params: { received: value }
    })
  }).optional()
)

export const ParsableAnimateSchema = (context, env) => {
  const preLayoutEnv = buildPreLayoutEnv(env)
  const layoutEnv = buildLayoutEnv(env)

  return SourceMappedObjectSchema.extend({
    onBeforeLayout: HookSchema(context, preLayoutEnv, ParseStage.BeforeLayout),
    hast: HastSchema(context, layoutEnv),
    css: CssSchema(context, layoutEnv),
    onBeforeCreate: HookSchema(context, env, ParseStage.BeforeCreate),
    anime: AnimeSchema(context, env),
    onCreated: HookSchema(context, env, ParseStage.Created),
    onBeforeBegin: HookSchema(context, env, ParseStage.BeforeBegin),
    onCompleted: HookSchema(context, env, ParseStage.Completed),
    onBeforeDestroy: HookSchema(context, preLayoutEnv, ParseStage.BeforeDestroy),
    onDestroyed: HookSchema(context, preLayoutEnv, ParseStage.Destroyed),
  }).strict()
}

export default ParsableAnimateSchema
