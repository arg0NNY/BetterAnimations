import Position from '@enums/Position'
import Direction from '@enums/Direction'

export function getRect (node) {
  const { x, y, top, left, right, bottom, width, height } = node.getBoundingClientRect()
  return { x, y, top, left, right, bottom, width, height }
}

export function reversePosition (position) {
  switch (position) {
    case Position.Top: return Position.Bottom
    case Position.Bottom: return Position.Top
    case Position.Left: return Position.Right
    case Position.Right: return Position.Left
    case Position.Center: return Position.Center
  }
}

export function getPosition (position, align = Position.Center) {
  if (position === Position.Center) return Position.Center
  if (align === Position.Center) return position

  const pair = [position, align]
  const equals = (a, b) => [a, b].every(p => pair.includes(p))

  if (equals(Position.Top, Position.Right)) return Position.TopRight
  if (equals(Position.Top, Position.Left)) return Position.TopLeft
  if (equals(Position.Bottom, Position.Right)) return Position.BottomRight
  if (equals(Position.Bottom, Position.Left)) return Position.BottomLeft
}

export function toDirection (position) {
  switch (position) {
    case Position.Top: return Direction.Upwards
    case Position.Bottom: return Direction.Downwards
    case Position.Left: return Direction.Leftwards
    case Position.Right: return Direction.Rightwards
    case Position.Center: return Direction.Backwards
  }
}

export function toPercent (value, rect) {
  if (typeof value === 'string')
    switch (value) {
      case Position.TopLeft: return [0, 0]
      case Position.Top: return [.5, 0]
      case Position.TopRight: return [1, 0]
      case Position.Left: return [0, .5]
      case Position.Center: return [.5, .5]
      case Position.Right: return [1, .5]
      case Position.BottomLeft: return [0, 1]
      case Position.Bottom: return [.5, 1]
      case Position.BottomRight: return [1, 1]
    }

  const [x, y] = value
  return [x / rect.width, y / rect.height]
}

export function toPx (value, rect) {
  const [x, y] = typeof value === 'string' ? toPercent(value, rect) : value
  return [x * rect.width, y * rect.height]
}

export function toUnit (value, unit, rect = undefined) {
  switch (unit) {
    case 'px': return toPx(value, rect)
    case '%': return toPercent(value, rect)
  }
}

export function getCenter (rect, unit, relative) {
  const [x, y] = [
    rect.x + rect.width / 2 - relative.x,
    rect.y + rect.height / 2 - relative.y
  ]

  if (unit === '%') return toPercent([x, y], relative)
  return [x, y]
}
