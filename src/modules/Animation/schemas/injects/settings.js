import { Defined, hasInSettings } from '@/helpers/schemas'
import { InjectSchema } from '@/modules/Animation/schemas/injects/InjectSchema'

export const DurationInjectSchema = ({ duration, hasDuration }) => InjectSchema('duration')
  .transform(hasInSettings('duration', hasDuration))
  .transform(() => duration)

export const EasingInjectSchema = ({ easing, hasEasing }) => InjectSchema('easing')
  .transform(hasInSettings('easing', hasEasing))
  .transform(() => easing)

export const VariantInjectSchema = ({ variant, availableVariants }) => InjectSchema('variant')
  .extend(Object.fromEntries(availableVariants?.map(v => [v, Defined]) ?? []))
  .transform(hasInSettings('variant', !!availableVariants))
  .transform(params => params[variant])
