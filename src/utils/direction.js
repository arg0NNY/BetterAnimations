import Axis from '@/enums/Axis'
import Direction from '@/enums/Direction'
import { toDirection } from '@/utils/position'

export function getDirectionsByAxis (axis) {
  switch (axis) {
    case Axis.X: return [Direction.Rightwards, Direction.Leftwards]
    case Axis.Y: return [Direction.Downwards, Direction.Upwards]
    case Axis.Z: return [Direction.Backwards, Direction.Forwards]
  }
}

export function getSupportedAxes (directions) {
  return Axis.values()
    .filter(axis => getDirectionsByAxis(axis).every(d => directions.includes(d)))
}

export function getDirection (axis, isMore) {
  return getDirectionsByAxis(axis)[+isMore]
}

export function reverseDirection (direction) {
  switch (direction) {
    case Direction.Upwards: return Direction.Downwards
    case Direction.Downwards: return Direction.Upwards
    case Direction.Leftwards: return Direction.Rightwards
    case Direction.Rightwards: return Direction.Leftwards
    case Direction.Forwards: return Direction.Backwards
    case Direction.Backwards: return Direction.Forwards
  }
}

export function getAnchorDirection (position, isTowards) {
  const direction = toDirection(position)
  return isTowards ? reverseDirection(direction) : direction
}
