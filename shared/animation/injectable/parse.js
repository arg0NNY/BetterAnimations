import deepMap, { baseStopPropagation } from '@animation/deepMap'
import { getSourcePath, isSourceMap, SELF_KEY } from '@animation/sourceMap'
import { generatedLazyInjectSymbol, isLazyInject, wrapLazyInject } from '@animation/schemas/injects/lazy'
import { trust } from '@animation/schemas/TrustedFunctionSchema'
import { injectDict, injectSchemas, injectTypes } from '@animation/schemas/injects'
import ParseStage from '@enums/ParseStage'
import { z } from 'zod'
import { formatValuesList } from '@utils/schemas'
import Debug from '@animation/debug'
import ErrorManager from '@error/manager'
import AnimationError from '@error/structs/AnimationError'
import { formatZodError } from '@animation/zod'
import Documentation from '@shared/documentation'
import isElement from 'lodash-es/isElement'
import Inject from '@enums/Inject'

export function assertInjectType (type) {
  if (Array.isArray(type)) return type.map(assertInjectType).filter(Boolean)
  return injectTypes.find(t => t.toLowerCase() === type.toLowerCase())
}

export function parseInject ({ schema, context, env, value, ctx }) {
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

const stopPropagation = value => baseStopPropagation(value) || value.inject === Inject.Raw

export function parseInjectable (value, context, env = {}, { path = [] } = {}) {
  const { allowed, disallowed, stage } = env

  const callback = (value, ctx) => {
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
                const groupEnd = path && Debug.animation(context.animation, context.type)
                  .lazyInjectCall(value.inject, path, args, context)

                try {
                  return parseInjectable(value, context, {
                    ...env,
                    stage: ParseStage.Lazy,
                    args
                  }, { path: ctx.path })
                }
                catch (error) {
                  groupEnd?.()
                  context.onError(
                    error instanceof AnimationError ? error : new AnimationError(
                      context.animation,
                      formatZodError(error, { pack: context.pack, data: value, context, path: ctx.path, sourceMap: { useSelf: true } }),
                      { module: context.module, pack: context.pack, type: context.type, context }
                    )
                  )
                  context.instance.cancel(true)
                }
                finally {
                  groupEnd?.()
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
  }

  return deepMap(value, callback, { stopPropagation, path })
}
