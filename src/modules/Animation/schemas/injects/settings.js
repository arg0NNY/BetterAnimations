import { buildSwitchSchema, Defined, formatValuesList, hasInSettings } from '@/helpers/schemas'
import { InjectSchema } from '@/modules/Animation/schemas/injects/InjectSchema'
import { z } from 'zod'
import Position from '@/enums/Position'
import Align from '@/enums/Align'
import Inject from '@/enums/Inject'
import Setting from '@/enums/AnimationSetting'
import Direction from '@/enums/Direction'

export const DurationInjectSchema = ({ duration, settings }) => InjectSchema(Inject.Duration)
  .transform(hasInSettings(Setting.Duration, !!settings?.[Setting.Duration]))
  .transform(() => duration)

export const EasingInjectSchema = ({ easing, settings }) => InjectSchema(Inject.Easing)
  .transform(hasInSettings(Setting.Easing, !!settings?.[Setting.Easing]))
  .transform(() => easing)

export const VariantInjectSchema = ({ variant, settings }) => {
  const availableVariants = settings?.[Setting.Variant]?.map(v => v.key)

  return InjectSchema(Inject.Variant)
    .extend(buildSwitchSchema(availableVariants))
    .transform(hasInSettings(Setting.Variant, !!availableVariants))
    .transform(params => params[variant])
}

function SwitchSchema (inject, setting, values, options = {}) {
  const { defaultValue, preprocess } = options

  return context => InjectSchema(inject)
    .extend(buildSwitchSchema(values, Defined.optional()))
    .transform(hasInSettings(setting, !!context.settings?.[setting]))
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

export const PositionInjectSchema = SwitchSchema(Inject.Position, Setting.Position, Position.values(), {
  defaultValue: Position.Center,
  preprocess: value => {
    switch (value) {
      case Position.Top: return Position.Bottom
      case Position.Bottom: return Position.Top
      case Position.Left: return Position.Right
      case Position.Right: return Position.Left
      default: return value
    }
  }
})

export const AlignInjectSchema = SwitchSchema(Inject.Align, Setting.Align, Align.values(), { defaultValue: Align.Center })

export const DirectionInjectSchema = SwitchSchema(Inject.Direction, Setting.Direction, Direction.values(), { defaultValue: Direction.Right })

// TODO: Consider custom settings and an inject for getting their value (prototype: add ability to create custom multiple selects inside "variant" settings)
