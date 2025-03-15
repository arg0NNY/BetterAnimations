import { z, ZodError } from 'zod'
import { formatValuesList, Literal, parseInjectSchemas } from '@/helpers/schemas'
import { InjectPlaceholderSchema, isInjectPlaceholder } from '@/modules/animation/schemas/injects/placeholder'
import { formatZodError, zodSubParse } from '@/helpers/zod'
import { isLazyInject, LazyInjectSchema, wrapLazyInject } from '@/modules/animation/schemas/injects/lazy'
import ParseStage from '@/enums/ParseStage'
import Spelling from 'spelling'
import ErrorManager from '@/modules/ErrorManager'
import AnimationError from '@/structs/AnimationError'
import * as CommonInjectSchemas from '@/modules/animation/schemas/injects/common'
import * as AnimeInjectSchemas from '@/modules/animation/schemas/injects/anime'
import * as SettingsInjectSchemas from '@/modules/animation/schemas/injects/settings'
import * as MathInjectSchemas from '@/modules/animation/schemas/injects/math'
import * as OperatorsInjectSchemas from '@/modules/animation/schemas/injects/operators'

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
  return zodSubParse(
    typeof schema === 'function'
      ? schema(context, env)
      : schema,
    value,
    { path: ctx.path }
  )
}

const InjectableSchema = (context, env = {}) => {
  const { allowed, disallowed, stage } = env

  const schema = z.lazy(
    () => z.union([
      Literal,
      z.function(), // Some injects return functions (anime.timeline, anime.setDashoffset, etc.)
      z.instanceof(Element), // Prevent Zod from parsing Element
      InjectPlaceholderSchema, // Prevent Zod from parsing InjectPlaceholder
      LazyInjectSchema, // Prevent Zod from parsing LazyInject
      z.array(schema),
      z.record(schema)
    ]).transform((value, ctx) => {
      try {
        if (isLazyInject(value)) // A parsed lazy inject, which turned into a generator function, awaiting a complete context
          return value.generator(context, env)

        if (isInjectPlaceholder(value))
          return zodSubParse(
            InjectableSchema(context, env),
            value.value,
            { path: ctx.path.concat(value.path) }
          )

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
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Inject '${value.inject}' is not allowed`,
                path: ['inject']
              })
              return z.NEVER
            }

            if (meta.immediate === true || (Array.isArray(meta.immediate) && meta.immediate.every(key => key in context)))
              return parseInject({ schema, context, env, value, ctx })

            if (meta.lazy)
              return wrapLazyInject(
                (context, env) => (...args) => {
                  try {
                    return InjectableSchema(context, {
                      ...env,
                      stage: ParseStage.Lazy,
                      args
                    }).parse(value, { path: ctx.path })
                  }
                  catch (error) {
                    ErrorManager.registerAnimationError(
                      new AnimationError(
                        context.animation,
                        formatZodError(error, { pack: context.pack, path: context.path, received: value }),
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
          if (error instanceof ZodError) throw error
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: error.message,
            path: ['inject'],
            params: { error }
          })
        }
      }
      catch (error) {
        if (error instanceof ZodError) throw error
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
