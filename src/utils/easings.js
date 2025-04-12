import { EasingType } from '@/enums/Easing'
import { capitalize } from '@/utils/text'

export function toAnimeEasing (easing) {
  switch (easing.type) {
    case EasingType.Linear: return 'linear'
    case EasingType.Ease: return `${easing.bezier}${capitalize(easing.style)}`
    case EasingType.Elastic: return `${easing.bezier}Elastic(${easing.amplitude}, ${easing.period})`
    case EasingType.Steps: return `steps(${easing.amount})`
  }
}
