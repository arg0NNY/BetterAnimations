import { EasingType } from '@shared/enums/Easing'
import { capitalize } from '@utils/text'
import { eases } from 'animejs'

export function getEasingFn (easing) {
  switch (easing.type) {
    case EasingType.Linear: return eases.linear()
    case EasingType.Ease: return eases[`${easing.bezier}${capitalize(easing.style)}`]
    case EasingType.Back: return eases[`${easing.bezier}Back`](easing.overshoot)
    case EasingType.Elastic: return eases[`${easing.bezier}Elastic`](easing.amplitude, easing.period)
    case EasingType.Steps: return eases.steps(easing.amount)
  }
}
