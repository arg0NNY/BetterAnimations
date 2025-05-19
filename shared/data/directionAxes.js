import Axis from '@enums/Axis'

const directionAxes = [
  { value: Axis.Y, name: 'Vertical', desc: 'Automatically choose between Upwards and Downwards' },
  { value: Axis.X, name: 'Horizontal', desc: 'Automatically choose between Leftwards and Rightwards' },
  { value: Axis.Z, name: 'Depth', desc: 'Automatically choose between Forwards and Backwards' }
]

export default directionAxes
