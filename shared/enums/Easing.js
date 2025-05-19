import Enum from '@shared/Enum'

export const EasingType = Enum({
  Linear: 'linear',
  Ease: 'ease',
  Back: 'back',
  Elastic: 'elastic',
  Steps: 'steps'
})

export const EasingBezier = Enum({
  In: 'in',
  Out: 'out',
  InOut: 'inOut'
})

export const EasingStyle = Enum({
  Sine: 'sine',
  Quad: 'quad',
  Cubic: 'cubic',
  Quart: 'quart',
  Quint: 'quint',
  Circ: 'circ',
  Expo: 'expo',
  Bounce: 'bounce'
})
