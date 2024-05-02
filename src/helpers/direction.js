import Axis from '@/enums/Axis'
import Direction from '@/enums/Direction'

export function getDirectionsByAxis (axis) {
  switch (axis) {
    case Axis.X: return [Direction.Rightwards, Direction.Leftwards]
    case Axis.Y: return [Direction.Downwards, Direction.Upwards]
    case Axis.Z: return [Direction.Backwards, Direction.Forwards]
  }
}

export function getDirection (axis, isMore) {
  return getDirectionsByAxis(axis)[+isMore]
}
