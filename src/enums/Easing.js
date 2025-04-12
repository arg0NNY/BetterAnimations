import Enum from '@/enums/Enum'

export const EasingType = Enum({
  Linear: 'linear',
  Ease: 'ease',
  Elastic: 'elastic',
  Steps: 'steps'
})

export const EasingBezier = Enum({
  In: 'in',
  Out: 'out',
  InOut: 'inOut',
  OutIn: 'outIn'
})

export const EasingStyle = Enum({
  Sine: 'sine',
  Quad: 'quad',
  Cubic: 'cubic',
  Quart: 'quart',
  Quint: 'quint',
  Expo: 'expo',
  Circ: 'circ',
  Back: 'back',
  Bounce: 'bounce'
})
