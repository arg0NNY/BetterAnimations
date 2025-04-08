import { z } from 'zod'
import { formatValuesList, Literal, parseInjectSchemas } from '@/utils/schemas'
import { formatZodError } from '@/utils/zod'
import {
  generatedLazyInjectSymbol,
  isLazyInject,
  LazyInjectSchema,
  wrapLazyInject
} from '@/modules/animation/schemas/injects/lazy'
import ParseStage from '@/enums/ParseStage'
import Spelling from 'spelling'
import ErrorManager from '@/modules/ErrorManager'
import AnimationError from '@/structs/AnimationError'
import * as CommonInjectSchemas from '@/modules/animation/schemas/injects/common'
import * as AnimeInjectSchemas from '@/modules/animation/schemas/injects/anime'
import * as SettingsInjectSchemas from '@/modules/animation/schemas/injects/settings'
import * as MathInjectSchemas from '@/modules/animation/schemas/injects/math'
import * as OperatorsInjectSchemas from '@/modules/animation/schemas/injects/operators'
import Debug from '@/modules/Debug'
import { getSourcePath, isSourceMap, SELF_KEY, SourceMapSchema } from '@/modules/animation/sourceMap'

const injectSchemas = {
  ...parseInjectSchemas(CommonInjectSchemas),
  ...parseInjectSchemas(AnimeInjectSchemas),
  ...parseInjectSchemas(SettingsInjectSchemas),
  ...parseInjectSchemas(MathInjectSchemas),
  ...parseInjectSchemas(OperatorsInjectSchemas)
}
const injectTypes = Object.keys(injectSchemas)
const injectDict = new Spelling(injectTypes)

function assertInjectType (type) {
  if (Array.isArray(type)) return type.map(assertInjectType).filter(Boolean)
  return injectTypes.find(t => t.toLowerCase() === type.toLowerCase())
}

function parseInject ({ schema, context, env, value, ctx }) {
  const report = Debug.animation(context.animation, context.type)
    .inject(value.inject, getSourcePath(value, SELF_KEY), context, value)

  try {
    const parsed = (
      typeof schema === 'function'
        ? schema(context, env)
        : schema
    ).parse(value, { path: ctx.path })
    report(parsed)
    return parsed
  }
  catch (error) {
    throw new AnimationError(
      context.animation,
      formatZodError(error, { pack: context.pack, data: value, context, path: ctx.path }),
      { module: context.module, pack: context.pack, type: context.type, context }
    )
  }
}

export const InjectableBaseSchema = (schema, extend = []) => z.union([
  Literal,
  z.symbol(),
  z.instanceof(Function), // Some injects return functions (anime.timeline, anime.setDashoffset, etc.)
  z.instanceof(Element), // Prevent Zod from parsing Element
  SourceMapSchema, // Prevent Zod from parsing SourceMap
  LazyInjectSchema, // Prevent Zod from parsing LazyInject
  ...extend,
  z.array(schema),
  z.record(schema)
])

const InjectableSchema = (context, env = {}) => {
  const { allowed, disallowed, stage } = env

  const schema = z.lazy(
    () => InjectableBaseSchema(schema).transform((value, ctx) => {
      try {
        if (isSourceMap(value)) return value

        if (isLazyInject(value)) { // A parsed lazy inject, which turned into a generator function, awaiting a complete context
          const generated = value.generator(context, env)
          generated[generatedLazyInjectSymbol] = value.name
          return generated
        }

        if (value?.inject === undefined)
          return value

        try {
          const [schema, meta = {}] = [].concat(injectSchemas[value.inject])

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
                  Debug.animation(context.animation, context.type)
                    .lazyInjectCall(value.inject, getSourcePath(value, SELF_KEY), args, context)

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
                        formatZodError(error, { pack: context.pack, data: value, context, path: ctx.path }),
                        { module: context.module, pack: context.pack, type: context.type, context, stage: 'Lazy' }
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
