import { z } from 'zod'
import { formatValuesList, Literal } from '@/helpers/schemas'
import Inject from '@/enums/Inject'
import ParseStage from '@/enums/ParseStage'
import {
  MathInjectSchema,
  ElementInjectSchema,
  ContainerInjectSchema,
  ObjectAssignInjectSchema,
  StringTemplateSchema,
  TypeInjectSchema,
  WaitInjectSchema,
  StyleRemovePropertyInjectSchema,
  UndefinedInjectSchema,
  FunctionInjectSchema,
  ModuleInjectSchema
} from '@/modules/animation/schemas/injects/common'
import {
  AnimeGetInjectSchema,
  AnimeSetInjectSchema,
  AnimeRandomInjectSchema,
  AnimeStaggerInjectSchema,
  AnimeTimelineInjectSchema
} from '@/modules/animation/schemas/injects/anime'
import {
  DirectionInjectSchema,
  DurationInjectSchema,
  EasingInjectSchema,
  PositionInjectSchema,
  VariantInjectSchema
} from '@/modules/animation/schemas/injects/settings'

const injectSchemas = {
  [Inject.Element]: ElementInjectSchema,
  [Inject.Container]: ContainerInjectSchema,
  [Inject.AnimeStagger]: AnimeStaggerInjectSchema,
  [Inject.AnimeTimeline]: AnimeTimelineInjectSchema,
  [Inject.AnimeRandom]: AnimeRandomInjectSchema,
  [Inject.AnimeGet]: AnimeGetInjectSchema,
  [Inject.AnimeSet]: AnimeSetInjectSchema,
  [Inject.Duration]: DurationInjectSchema,
  [Inject.Easing]: EasingInjectSchema,
  [Inject.Variant]: VariantInjectSchema,
  [Inject.Position]: PositionInjectSchema,
  [Inject.Module]: ModuleInjectSchema,
  [Inject.Type]: TypeInjectSchema,
  [Inject.ObjectAssign]: ObjectAssignInjectSchema,
  [Inject.Wait]: WaitInjectSchema,
  [Inject.StringTemplate]: StringTemplateSchema,
  [Inject.Math]: MathInjectSchema,
  [Inject.Direction]: DirectionInjectSchema,
  [Inject.StyleRemoveProperty]: StyleRemovePropertyInjectSchema,
  [Inject.Undefined]: UndefinedInjectSchema,
  [Inject.Function]: FunctionInjectSchema
}
const injectTypes = Object.keys(injectSchemas)

function parseInject ({ schema, context, value, ctx }) {
  const { success, data, error } = (
    typeof schema === 'function' ? schema(context) : schema
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
      z.instanceof(HTMLElement), // Prevent Zod from parsing HTMLElement
      z.array(schema),
      z.record(schema)
    ]).transform((value, ctx) => {
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
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Inject type '${value.inject}' is not allowed here. Only injects of these types can be used here: ${formatValuesList(injectTypes.filter(i => !disallowed?.includes(i) && (!allowed || allowed.includes(i))))}` })
          return z.NEVER
        }

        if (meta.immediate === true || (Array.isArray(meta.immediate) && meta.immediate.every(key => key in context)))
          return parseInject({ schema, context, value, ctx })

        return value
      }

      if (stage === ParseStage.Execute && meta.lazy)
        return () => InjectableSchema(context, { ...env, stage: ParseStage.Lazy }).parse(value)

      return parseInject({ schema, context, value, ctx })
    })
  )

  return schema
}

export default InjectableSchema
