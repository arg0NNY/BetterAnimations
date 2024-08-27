import { z } from 'zod'
import { formatValuesList, Literal, parseInjectSchemas } from '@/helpers/schemas'
import ParseStage from '@/enums/ParseStage'
import * as CommonInjectSchemas from '@/modules/animation/schemas/injects/common'
import * as AnimeInjectSchemas from '@/modules/animation/schemas/injects/anime'
import * as SettingsInjectSchemas from '@/modules/animation/schemas/injects/settings'
import * as MathInjectSchemas from '@/modules/animation/schemas/injects/math'

const injectSchemas = {
  ...parseInjectSchemas(CommonInjectSchemas),
  ...parseInjectSchemas(AnimeInjectSchemas),
  ...parseInjectSchemas(SettingsInjectSchemas),
  ...parseInjectSchemas(MathInjectSchemas)
}
const injectTypes = Object.keys(injectSchemas)

function parseInject ({ schema, context, env, value, ctx }) {
  const { success, data, error } = (
    typeof schema === 'function' ? schema(context, env) : schema
  ).safeParse(value)

  if (!success) {
    error.issues.forEach(i => ctx.addIssue(i))
    return z.NEVER
  }
  return data
}

const InjectableSchema = (context, env = {}) => {
  const { allowed, disallowed, stage } = env

  const schema = z.lazy(
    () => z.union([
      Literal,
      z.function(), // Lazy injects are transformed into functions
      z.instanceof(Element), // Prevent Zod from parsing Element
      z.array(schema),
      z.record(schema)
    ]).transform((value, ctx) => {
      // If we meet a function, that's a parsed lazy inject, which turned into a generator function, awaiting a complete context
      if (typeof value === 'function') return value(context, env)

      if (value?.inject === undefined) return value

      const [schema, meta = {}] = [].concat(injectSchemas[value.inject])

      if (stage === ParseStage.Initialize) {
        if (!schema) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Unknown inject '${value.inject}'. Available injects: ${formatValuesList(Object.keys(injectSchemas))}` })
          return z.NEVER
        }

        if (
          (disallowed?.length && disallowed.includes(value.inject))
          || (allowed?.length && !allowed.includes(value.inject))
        ) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Inject '${value.inject}' is not allowed here. Only injects of these types can be used here: ${formatValuesList(injectTypes.filter(i => !disallowed?.includes(i) && (!allowed || allowed.includes(i))))}` })
          return z.NEVER
        }

        if (meta.immediate === true || (Array.isArray(meta.immediate) && meta.immediate.every(key => key in context)))
          return parseInject({ schema, context, env, value, ctx })

        if (meta.lazy)
          return (context, env) => (...args) => InjectableSchema(context, {
            ...env,
            stage: ParseStage.Lazy,
            args
          }).parse(value)

        return value
      }

      return parseInject({ schema, context, env, value, ctx })
    })
  )

  return schema
}

export default InjectableSchema
