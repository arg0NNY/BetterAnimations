import Auto from '@shared/enums/Auto'
import Direction from '@shared/enums/Direction'

const directions = [
  { value: Auto(Direction).Auto, label: 'Auto' },
  { value: Direction.Upwards, label: 'Upwards' },
  { value: Direction.Downwards, label: 'Downwards' },
  { value: Direction.Leftwards, label: 'Leftwards' },
  { value: Direction.Rightwards, label: 'Rightwards' },
  { value: Direction.Forwards, label: 'Forwards' },
  { value: Direction.Backwards, label: 'Backwards' }
]

export default directions
