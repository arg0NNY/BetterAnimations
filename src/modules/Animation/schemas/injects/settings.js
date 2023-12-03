import { buildSwitchSchema, Defined, formatValuesList, hasInSettings } from '@/helpers/schemas'
import { InjectSchema } from '@/modules/Animation/schemas/injects/InjectSchema'
import { z } from 'zod'
import Position from '@/enums/Position'
import Align from '@/enums/Align'
import Inject from '@/enums/Inject'
import Setting from '@/enums/AnimationSetting'

export const DurationInjectSchema = ({ duration, settings }) => InjectSchema(Inject.Duration)
  .transform(hasInSettings(Setting.Duration, !!settings?.duration))
  .transform(() => duration)

export const EasingInjectSchema = ({ easing, settings }) => InjectSchema(Inject.Easing)
  .transform(hasInSettings(Setting.Easing, !!settings?.easing))
  .transform(() => easing)

export const VariantInjectSchema = ({ variant, settings }) => {
  const availableVariants = settings?.variant?.map(v => v.key)

  return InjectSchema(Inject.Variant)
    .extend(buildSwitchSchema(availableVariants))
    .transform(hasInSettings(Setting.Variant, !!availableVariants))
    .transform(params => params[variant])
}

// TODO: Combine position and align injects into helper function
export const PositionInjectSchema = ({ position, settings }) => {
  const keys = Position.values()
  const reverse = key => {
    switch (key) {
      case Position.Top: return Position.Bottom
      case Position.Bottom: return Position.Top
      case Position.Left: return Position.Right
      case Position.Right: return Position.Left
      default: return key
    }
  }

  return InjectSchema(Inject.Position)
    .extend(buildSwitchSchema(keys, Defined.optional()))
    .transform(hasInSettings(Setting.Position, !!settings?.position))
    .transform((params, ctx) => {
      if (!keys.includes(position)) position = Position.Center
      position = reverse(position)

      if (keys.some(k => k in params))
        if (keys.every(k => k in params)) return params[position]
        else {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `All of the possible values must be defined in the '${Inject.Position}' inject when using switch mode. Missing keys: ${formatValuesList(keys.filter(k => !(k in params)))}` })
          return z.NEVER
        }
      else return position
    })
}

export const AlignInjectSchema = ({ align, settings }) => {
  const keys = Align.values()

  return InjectSchema(Inject.Align)
    .extend(buildSwitchSchema(keys, Defined.optional()))
    .transform(hasInSettings(Setting.Align, !!settings?.align))
    .transform((params, ctx) => {
      if (!keys.includes(align)) align = Align.Center

      if (keys.some(k => k in params))
        if (keys.every(k => k in params)) return params[align]
        else {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `All of the possible values must be defined in the '${Inject.Align}' inject when using switch mode. Missing keys: ${formatValuesList(keys.filter(k => !(k in params)))}` })
          return z.NEVER
        }
      else return align
    })
}

// export const DirectionInjectSchema = ({ direction, settings })

// TODO: Consider custom settings and an inject for getting their value (prototype: add ability to create custom multiple selects inside "variant" settings)
