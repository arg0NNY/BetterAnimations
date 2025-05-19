import Position from '@enums/Position'
import Auto from '@enums/Auto'

const positions = [
  { value: Auto(Position).Auto, label: 'Auto' },
  { value: Position.TopLeft, label: 'Top Left' },
  { value: Position.Top, label: 'Top' },
  { value: Position.TopRight, label: 'Top Right' },
  { value: Position.Left, label: 'Left' },
  { value: Position.Center, label: 'Center' },
  { value: Position.Right, label: 'Right' },
  { value: Position.BottomLeft, label: 'Bottom Left' },
  { value: Position.Bottom, label: 'Bottom' },
  { value: Position.BottomRight, label: 'Bottom Right' }
]

export default positions
