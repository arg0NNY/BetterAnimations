import { z } from 'zod'
import { formatValuesList } from '@utils/schemas'
import { formatZodError } from '@utils/zod'
import { generatedLazyInjectSymbol, isLazyInject, wrapLazyInject } from '@animation/schemas/injects/lazy'
import ParseStage from '@enums/ParseStage'
import ErrorManager from '@error/manager'
import AnimationError from '@error/structs/AnimationError'
import { RawInjectBaseSchema } from '@animation/schemas/injects/general'
import Debug from '@logger/debug'
import { getSourcePath, isSourceMap, SELF_KEY } from '@animation/sourceMap'
import { trust } from '@animation/schemas/TrustedFunctionSchema'
import Documentation from '@shared/documentation'
import InjectableBaseSchema from '@animation/schemas/InjectableBaseSchema'
import { injectDict, injectSchemas, injectTypes } from '@animation/schemas/injects'

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
