import Position from '@/enums/Position'

export function simplifyPosition (position) {
  switch (position) {
    case Position.TopLeft:
    case Position.TopRight:
      return Position.Top

    case Position.BottomLeft:
    case Position.BottomRight:
      return Position.Bottom

    default: return position
  }
}
