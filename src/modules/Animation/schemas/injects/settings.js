import { Defined, hasInSettings } from '@/helpers/schemas'
import { InjectSchema } from '@/modules/Animation/schemas/injects/InjectSchema'

export const DurationInjectSchema = ({ duration, settings }) => InjectSchema('duration')
  .transform(hasInSettings('duration', !!settings?.duration))
  .transform(() => duration)

export const EasingInjectSchema = ({ easing, settings }) => InjectSchema('easing')
  .transform(hasInSettings('easing', !!settings?.easing))
  .transform(() => easing)

export const VariantInjectSchema = ({ variant, settings }) => {
  const availableVariants = settings?.variant?.map(v => v.key)

  return InjectSchema('variant')
    .extend(Object.fromEntries(availableVariants?.map(v => [v, Defined]) ?? []))
    .transform(hasInSettings('variant', !!availableVariants))
    .transform(params => params[variant])
}
