import { z } from 'zod'
import { buildSwitchSchema, Defined, formatValuesList, hasInSettings } from '@/helpers/schemas'

export const InjectSchema = type => z.object({ inject: z.literal(type) }).strict()

export function SwitchSchema (inject, valueList, options = {}) {
  const { currentValue, defaultValue, possibleValues, setting } = options

  return context => {
    const get = value => typeof value === 'function' ? value(context) : value

    let values = get(valueList)

    let schema = InjectSchema(inject)
      .extend(buildSwitchSchema(values, Defined.optional()))

    if (setting) schema = schema.transform(hasInSettings(inject, !!context.settings?.[setting]))

    return schema.transform((params, ctx) => {
      if (possibleValues)
        values = values.filter(v => get(possibleValues).includes(v))
      else if (setting && context.settings[setting] !== true)
        values = values.filter(v => context.settings[setting].includes(v))

      let value = get(currentValue) ?? (setting && context[setting])
      if (!values.includes(value)) value = defaultValue

      if (values.some(k => k in params))
        if (values.every(k => k in params)) return params[value]
        else {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `All of the possible values must be defined in the '${inject}' inject when using switch mode. Missing keys: ${formatValuesList(values.filter(k => !(k in params)))}` })
          return z.NEVER
        }
      else return value
    })
  }
}
