import { z } from 'zod'
import { formatValuesList, Literal } from '@/helpers/schemas'
import Inject from '@/enums/Inject'
import {
  MathInjectSchema,
  ElementInjectSchema,
  ContainerInjectSchema,
  ObjectAssignInjectSchema,
  StringTemplateSchema,
  TypeInjectSchema,
  WaitInjectSchema
} from '@/modules/animation/schemas/injects/common'
import {
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
  [Inject.Duration]: DurationInjectSchema,
  [Inject.Easing]: EasingInjectSchema,
  [Inject.Variant]: VariantInjectSchema,
  [Inject.Position]: PositionInjectSchema,
  [Inject.Type]: TypeInjectSchema,
  [Inject.ObjectAssign]: ObjectAssignInjectSchema,
  [Inject.Wait]: WaitInjectSchema,
  [Inject.StringTemplate]: StringTemplateSchema,
  [Inject.Math]: MathInjectSchema,
  [Inject.AnimeRandom]: AnimeRandomInjectSchema,
  [Inject.Direction]: DirectionInjectSchema
}
const injectTypes = Object.keys(injectSchemas)

const InjectableSchema = (context, { allowed, disallowed } = {}) => {
  const schema = z.lazy(
    () => z.union([
      Literal,
      z.array(schema),
      z.record(schema)
    ]).transform((value, ctx) => {
      if (value?.inject === undefined) return value

      if (
        (disallowed?.length && disallowed.includes(value.inject))
        || (allowed?.length && !allowed.includes(value.inject))
      ) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Inject type '${value.inject}' is not allowed here. Only injects of these types can be used here: ${formatValuesList(injectTypes.filter(i => !disallowed?.includes(i) && (!allowed || allowed.includes(i))))}` })
        return z.NEVER
      }

      const schema = injectSchemas[value.inject]
      if (!schema) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Unknown inject '${value.inject}'. Available injects: ${formatValuesList(Object.keys(injectSchemas))}` })
        return z.NEVER
      }

      const { success, data, error } = (
        typeof schema === 'function' ? schema(context) : schema
      ).safeParse(value)

      if (!success) {
        error.issues.forEach(i => ctx.addIssue(i))
        return z.NEVER
      }
      return data
    })
  )

  return schema
}

export default InjectableSchema
