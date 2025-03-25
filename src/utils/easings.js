import { EasingType } from '@/enums/Easing'
import { capitalize } from '@/utils/text'
import anime from 'animejs'

export function toAnimeEasing (easing) {
  switch (easing.type) {
    case EasingType.Linear: return 'linear'
    case EasingType.Ease: return `ease${capitalize(easing.bezier)}${capitalize(easing.style)}`
    case EasingType.Spring: return `spring(${easing.mass}, ${easing.stiffness}, ${easing.damping}, ${easing.velocity})`
    case EasingType.Elastic: return `ease${capitalize(easing.bezier)}Elastic(${easing.amplitude}, ${easing.period})`
    case EasingType.Steps: return `steps(${easing.amount})`
  }
}

export function getDuration (easing) {
  if (typeof easing === 'object') easing = toAnimeEasing(easing)
  return anime.easing(easing)()
}
