import Position from '@/enums/Position'

export function reversePosition (position) {
  switch (position) {
    case Position.Top: return Position.Bottom
    case Position.Bottom: return Position.Top
    case Position.Left: return Position.Right
    case Position.Right: return Position.Left
    case Position.Center: return Position.Center
  }
}

export function getPosition (position, align) {
  if (position === Position.Center) return Position.Center
  if (align === Position.Center) return position

  const pair = [position, align]
  const equals = (a, b) => [a, b].every(p => pair.includes(p))

  if (equals(Position.Top, Position.Right)) return Position.TopRight
  if (equals(Position.Top, Position.Left)) return Position.TopLeft
  if (equals(Position.Bottom, Position.Right)) return Position.BottomRight
  if (equals(Position.Bottom, Position.Left)) return Position.BottomLeft
}
