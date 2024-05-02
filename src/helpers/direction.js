import Axis from '@/enums/Axis'
import Direction from '@/enums/Direction'

export function getDirectionsByAxis (axis) {
  switch (axis) {
    case Axis.X: return [Direction.Leftwards, Direction.Rightwards]
    case Axis.Y: return [Direction.Upwards, Direction.Downwards]
    case Axis.Z: return [Direction.Forwards, Direction.Backwards]
  }
}
