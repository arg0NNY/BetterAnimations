import { z } from 'zod'
import { formatValuesList, Literal } from '@/helpers/schemas'
import {
  NodeInjectSchema,
  ObjectAssignInjectSchema,
  StringTemplateSchema,
  TypeInjectSchema,
  WaitInjectSchema
} from '@/modules/Animation/schemas/injects/common'
import {
  AnimeStaggerInjectSchema,
  AnimeTimelineInjectSchema
} from '@/modules/Animation/schemas/injects/anime'
import {
  AlignInjectSchema,
  DurationInjectSchema,
  EasingInjectSchema,
  PositionInjectSchema,
  VariantInjectSchema
} from '@/modules/Animation/schemas/injects/settings'

const injectSchemas = {
  'node': NodeInjectSchema,
  'anime.stagger': AnimeStaggerInjectSchema,
  'anime.timeline': AnimeTimelineInjectSchema,
  'duration': DurationInjectSchema,
  'easing': EasingInjectSchema,
  'variant': VariantInjectSchema,
  'position': PositionInjectSchema,
  'align': AlignInjectSchema,
  'type': TypeInjectSchema,
  'Object.assign': ObjectAssignInjectSchema,
  'wait': WaitInjectSchema,
  'string.template': StringTemplateSchema
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
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Unknown inject type '${value.inject}'. Available injects: ${formatValuesList(Object.keys(injectSchemas))}` })
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
