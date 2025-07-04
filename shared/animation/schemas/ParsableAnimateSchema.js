import { z } from 'zod'
import { ArrayOrSingleSchema } from '@utils/schemas'
import ParseStage from '@enums/ParseStage'
import { sanitize } from 'hast-util-sanitize'
import { toDom } from 'hast-util-to-dom'
import { executeWithZod } from '@animation/utils'
import { storeInjectable } from '@animation/schemas/SanitizeInjectableSchema'
import hastSanitizeSchema from '@animation/hastSanitizeSchema'
import { clearSourceMapDeep, SourceMappedObjectSchema, SourceMapSchema } from '@animation/sourceMap'
import TrustedFunctionSchema from '@animation/schemas/TrustedFunctionSchema'
import ParsableSchema from '@animation/schemas/ParsableSchema'
import AnimeSchema from '@animation/schemas/AnimeSchema'
import { zodTransformErrorBoundary } from '@utils/zod'
import { layoutDependentInjects, safeInjects } from '@animation/schemas/injects'

export function buildPreLayoutEnv (env) {
  return Object.assign({ disallowed: layoutDependentInjects }, env)
}

export function buildLayoutEnv (env) {
  return Object.assign({ allowed: safeInjects, disallowed: layoutDependentInjects }, env)
}

export const HookSchema = (context, env, stage) => ParsableSchema(
  stage,
  context => ArrayOrSingleSchema(
    ArrayOrSingleSchema(
      TrustedFunctionSchema.nullable()
    )
  ).transform(
    zodTransformErrorBoundary((value, ctx) => {
      const hook = () => executeWithZod(value, (value, ctx) => {
        [].concat(value).flat().forEach((fn, i) => {
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
      return storeInjectable(hook, value)
    })
  ).optional()
)(context, env)

export const HastSchema = ParsableSchema(
  ParseStage.Layout,
  ArrayOrSingleSchema(
    ArrayOrSingleSchema(
      z.record(z.any()).nullable()
    )
  ).transform(
    zodTransformErrorBoundary((value, ctx) => {
      return [].concat(value).flat().filter(Boolean).map((node, i) => {
        const sanitized = sanitize(clearSourceMapDeep(node), hastSanitizeSchema)
        if (sanitized.type === 'root') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Invalid or forbidden hast node',
            path: Array.isArray(value) ? [i] : [],
            params: { received: node }
          })
          return z.NEVER
        }

        return storeInjectable(
          toDom(sanitized),
          value
        )
      })
    })
  ).optional()
)


export const CssSchema = ParsableSchema(
  ParseStage.Layout,
  ArrayOrSingleSchema(
    ArrayOrSingleSchema(
      z.record(
        z.union([
          z.record(
            z.union([z.string(), z.number(), SourceMapSchema])
          ),
          SourceMapSchema
        ])
      ).nullable()
    )
  ).optional()
)

export const ParsableAnimeSchema = ParsableSchema(
  ParseStage.Anime,
  AnimeSchema
)

export const ParsableAnimateSchema = (context, env) => {
  const preLayoutEnv = buildPreLayoutEnv(env)
  const layoutEnv = buildLayoutEnv(env)

  return SourceMappedObjectSchema.extend({
    onBeforeLayout: HookSchema(context, preLayoutEnv, ParseStage.BeforeLayout),
    hast: HastSchema(context, layoutEnv),
    css: CssSchema(context, layoutEnv),
    onBeforeCreate: HookSchema(context, env, ParseStage.BeforeCreate),
    anime: ParsableAnimeSchema(context, env),
    onCreated: HookSchema(context, env, ParseStage.Created),
    onBeforeBegin: HookSchema(context, env, ParseStage.BeforeBegin),
    onCompleted: HookSchema(context, env, ParseStage.Completed),
    onBeforeDestroy: HookSchema(context, preLayoutEnv, ParseStage.BeforeDestroy),
    onDestroyed: HookSchema(context, preLayoutEnv, ParseStage.Destroyed),
  }).strict()
}

export default ParsableAnimateSchema
