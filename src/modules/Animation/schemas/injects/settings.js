import { buildSwitchSchema, Defined, formatValuesList, hasInSettings } from '@/helpers/schemas'
import { InjectSchema } from '@/modules/Animation/schemas/injects/InjectSchema'
import { z } from 'zod'
import Position from '@/enums/Position'
import Inject from '@/enums/Inject'
import Setting from '@/enums/AnimationSetting'
import Direction from '@/enums/Direction'

export const DurationInjectSchema = ({ duration, settings }) => InjectSchema(Inject.Duration)
  .transform(hasInSettings(Inject.Duration, !!settings?.[Setting.Duration]))
  .transform(() => duration)

export const EasingInjectSchema = ({ easing, settings }) => InjectSchema(Inject.Easing)
  .transform(hasInSettings(Inject.Easing, !!settings?.[Setting.Easing]))
  .transform(() => easing)

function SwitchSchema (inject, setting, valueList, options = {}) {
  const { defaultValue, preprocess } = options

  return context => {
    const values = typeof valueList === 'function' ? valueList(context) : valueList

    return InjectSchema(inject)
      .extend(buildSwitchSchema(values, Defined.optional()))
      .transform(hasInSettings(inject, !!context.settings?.[setting]))
      .transform((params, ctx) => {
        let value = context[setting]
        if (!values.includes(value)) value = defaultValue
        if (preprocess) value = preprocess(value)

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

export const VariantInjectSchema = SwitchSchema(Inject.Variant, Setting.Variant, ctx => ctx.settings?.[Setting.Variant]?.map(v => v.key))

export const PositionInjectSchema = SwitchSchema(Inject.Position, Setting.Position, Position.values(), { defaultValue: Position.Center })

export const DirectionInjectSchema = SwitchSchema(Inject.Direction, Setting.Direction, Direction.values(), { defaultValue: Direction.Right })

// TODO: Consider custom settings and an inject for getting their value (prototype: add ability to create custom multiple selects inside "variant" settings)
