import { EasingBezier, EasingStyle, EasingType } from '@enums/Easing'

export const easingTypes = [
  { value: EasingType.Linear, label: 'Linear' },
  { value: EasingType.Ease, label: 'Ease' },
  { value: EasingType.Back, label: 'Back' },
  { value: EasingType.Elastic, label: 'Elastic' },
  { value: EasingType.Steps, label: 'Steps' }
]

export const easingBeziers = [
  { value: EasingBezier.In, label: 'In' },
  { value: EasingBezier.Out, label: 'Out' },
  { value: EasingBezier.InOut, label: 'In Out' }
]

export const easingStyles = [
  { value: EasingStyle.Sine, label: 'Sine' },
  { value: EasingStyle.Quad, label: 'Quad' },
  { value: EasingStyle.Cubic, label: 'Cubic' },
  { value: EasingStyle.Quart, label: 'Quart' },
  { value: EasingStyle.Quint, label: 'Quint' },
  { value: EasingStyle.Circ, label: 'Circ' },
  { value: EasingStyle.Expo, label: 'Expo' },
  { value: EasingStyle.Bounce, label: 'Bounce' }
]

export const easingValues = {
  [EasingType.Back]: {
    overshoot: {
      min: 1,
      max: 10,
      default: 1.7,
      fractionDigits: 2
    }
  },
  [EasingType.Elastic]: {
    amplitude: {
      min: 1,
      max: 10,
      default: 1,
      fractionDigits: 2
    },
    period: {
      min: .1,
      max: 2,
      default: .5,
      fractionDigits: 2
    }
  },
  [EasingType.Steps]: {
    amount: {
      min: 1,
      max: 100,
      default: 10
    }
  }
}
