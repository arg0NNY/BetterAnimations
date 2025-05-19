import { z } from 'zod'
import { formatValuesList } from '@/utils/schemas'
import { formatZodError } from '@/utils/zod'
import {
  generatedLazyInjectSymbol,
  isLazyInject,
  wrapLazyInject
} from '@animation/schemas/injects/lazy'
import ParseStage from '@shared/enums/ParseStage'
import Spelling from 'spelling'
import ErrorManager from '@/modules/ErrorManager'
import AnimationError from '@/structs/AnimationError'
import * as GeneralInjectSchemas from '@animation/schemas/injects/general'
import * as ObjectInjectSchemas from '@animation/schemas/injects/object'
import * as ArrayInjectSchemas from '@animation/schemas/injects/array'
import * as AnimeInjectSchemas from '@animation/schemas/injects/anime'
import * as SettingsInjectSchemas from '@animation/schemas/injects/settings'
import * as MathInjectSchemas from '@animation/schemas/injects/math'
import * as OperatorsInjectSchemas from '@animation/schemas/injects/operators'
import * as AccordionsInjectSchemas from '@animation/schemas/injects/accordions'
import * as SnippetsInjectSchemas from '@animation/schemas/injects/snippets'
import Debug from '@/modules/Debug'
import { getSourcePath, isSourceMap, SELF_KEY } from '@animation/sourceMap'
import TrustedFunctionSchema, { trust } from '@animation/schemas/TrustedFunctionSchema'
import { ObjectDeepBaseSchema } from '@animation/schemas/ObjectDeepSchema'
import { RawInjectBaseSchema } from '@animation/schemas/injects/general'
import { parseInjectSchemas } from '@animation/schemas/utils'
import Documentation from '@/modules/Documentation'

export const groupedInjectSchemas = {
  general: parseInjectSchemas(GeneralInjectSchemas),
  object: parseInjectSchemas(ObjectInjectSchemas),
  array: parseInjectSchemas(ArrayInjectSchemas),
  anime: parseInjectSchemas(AnimeInjectSchemas),
  settings: parseInjectSchemas(SettingsInjectSchemas),
  math: parseInjectSchemas(MathInjectSchemas),
  operators: parseInjectSchemas(OperatorsInjectSchemas),
  accordions: parseInjectSchemas(AccordionsInjectSchemas),
  snippets: parseInjectSchemas(SnippetsInjectSchemas)
}
export const injectSchemas = Object.assign({}, ...Object.values(groupedInjectSchemas))
export const injectTypes = Object.keys(injectSchemas)
const injectDict = new Spelling(injectTypes)

function assertInjectType (type) {
  if (Array.isArray(type)) return type.map(assertInjectType).filter(Boolean)
  return injectTypes.find(t => t.toLowerCase() === type.toLowerCase())
}

function parseInject ({ schema, context, env, value, ctx }) {
  const path = getSourcePath(value, SELF_KEY)
  const report = path && Debug.animation(context.animation, context.type)
    .inject(value.inject, path, context, value)

  try {
    const parsed = (
      typeof schema === 'function'
        ? schema(context, env)
        : schema
    ).parse(value, { path: ctx.path })
    report?.(parsed)
    return parsed
  }
  catch (error) {
    throw error instanceof AnimationError ? error : new AnimationError(
      context.animation,
      formatZodError(error, {
        pack: context.pack,
        data: value,
        context,
        path: ctx.path,
        sourceMap: { useSelf: true },
        docs: Documentation.getInjectUrl(value.inject)
      }),
      { module: context.module, pack: context.pack, type: context.type, context }
    )
  }
}

export const InjectableBaseSchema = (schema, extend = []) =>
  ObjectDeepBaseSchema(schema, [TrustedFunctionSchema, ...extend])

export const InjectableValidateSchema = z.lazy(
  () => InjectableBaseSchema(InjectableValidateSchema)
)

const InjectableSchema = (context, env = {}) => {
  const { allowed, disallowed, stage } = env

  const schema = z.lazy(
    () => InjectableBaseSchema(
      schema,
      [RawInjectBaseSchema]
    ).transform((value, ctx) => {
      try {
        if (isSourceMap(value)) return value

        if (isLazyInject(value)) { // A parsed lazy inject, which turned into a generator function, awaiting a complete context
          const generated = value.generator(context, env)
          generated[generatedLazyInjectSymbol] = value.name
          return trust(generated)
        }

        if (value?.inject === undefined)
          return value

        try {
          const [schema, meta] = injectSchemas[value.inject] ?? []

          if (stage === ParseStage.Initialize) {
            if (!schema) {
              const { found, word, suggestions } = injectDict.lookup(String(value.inject))
              const injects = assertInjectType(found ? [word] : suggestions.map(s => s.word))
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Unknown inject '${value.inject}'`
                  + (injects.length ? `. Did you mean: ${formatValuesList(injects)}` : ''),
                path: ['inject']
              })
              return z.NEVER
            }

            if (
              (disallowed?.length && disallowed.includes(value.inject))
              || (allowed?.length && !allowed.includes(value.inject))
              || (typeof meta.allowed === 'function' && !meta.allowed({ value, context, ctx, env }))
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Inject '${value.inject}' is not allowed`
              })
              return z.NEVER
            }

            if (meta.immediate === true || (Array.isArray(meta.immediate) && meta.immediate.every(key => key in context)))
              return parseInject({ schema, context, env, value, ctx })

            if (meta.lazy)
              return wrapLazyInject(
                value.inject,
                (context, env) => (...args) => {
                  const path = getSourcePath(value, SELF_KEY)
                  if (path)
                    Debug.animation(context.animation, context.type)
                      .lazyInjectCall(value.inject, path, args, context)

                  try {
                    return InjectableSchema(context, {
                      ...env,
                      stage: ParseStage.Lazy,
                      args
                    }).parse(value, { path: ctx.path })
                  }
                  catch (error) {
                    ErrorManager.registerAnimationError(
                      error instanceof AnimationError ? error : new AnimationError(
                        context.animation,
                        formatZodError(error, { pack: context.pack, data: value, context, path: ctx.path, sourceMap: { useSelf: true } }),
                        { module: context.module, pack: context.pack, type: context.type, context }
                      )
                    )
                    context.instance.cancel(true)
                  }
                }
              )

            return value
          }

          return parseInject({ schema, context, env, value, ctx })
        }
        catch (error) {
          if (error instanceof AnimationError) throw error
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: error.message,
            path: ['inject'],
            params: { error }
          })
        }
      }
      catch (error) {
        if (error instanceof AnimationError) throw error
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: error.message,
          params: { error }
        })
      }
    })
  )

  return schema
}

export default InjectableSchema
