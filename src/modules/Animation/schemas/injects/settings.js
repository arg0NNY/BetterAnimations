import { buildSwitchSchema, Defined, formatValuesList, hasInSettings } from '@/helpers/schemas'
import { InjectSchema } from '@/modules/Animation/schemas/injects/InjectSchema'
import { z } from 'zod'

export const DurationInjectSchema = ({ duration, settings }) => InjectSchema('duration')
  .transform(hasInSettings('duration', !!settings?.duration))
  .transform(() => duration)

export const EasingInjectSchema = ({ easing, settings }) => InjectSchema('easing')
  .transform(hasInSettings('easing', !!settings?.easing))
  .transform(() => easing)

export const VariantInjectSchema = ({ variant, settings }) => {
  const availableVariants = settings?.variant?.map(v => v.key)

  return InjectSchema('variant')
    .extend(buildSwitchSchema(availableVariants))
    .transform(hasInSettings('variant', !!availableVariants))
    .transform(params => params[variant])
}

export const PositionInjectSchema = ({ position, settings }) => {
  const keys = ['top', 'bottom', 'left', 'right', 'center']
  const reverse = key => {
    switch (key) {
      case 'top': return 'bottom'
      case 'bottom': return 'top'
      case 'left': return 'right'
      case 'right': return 'left'
      default: return key
    }
  }

  return InjectSchema('position')
    .extend(buildSwitchSchema(keys, Defined.optional()))
    .transform(hasInSettings('position', !!settings?.position))
    .transform((params, ctx) => {
      if (!keys.includes(position)) position = 'center'
      position = reverse(position)

      if (keys.some(k => k in params))
        if (keys.every(k => k in params)) return params[position]
        else {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `All of the possible values must be defined in the 'position' inject when using switch mode. Missing keys: ${formatValuesList(keys.filter(k => !(k in params)))}` })
          return z.NEVER
        }
      else return position
    })
}

// TODO: Add "direction" inject
// TODO: Consider custom settings and an inject for getting their value
