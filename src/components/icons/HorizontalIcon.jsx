import useIconSize from '@/hooks/useIconSize'
import { colors } from '@discord/modules'

function HorizontalIcon ({ size, width, height, color = colors.INTERACTIVE_ICON_DEFAULT }) {
  return (
    <svg
      {...useIconSize(size, { width, height })}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke={typeof color === 'string' ? color : color.css}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 12h18M3 12l3 3m-3-3l3-3m15 3l-3-3m3 3l-3 3"
      />
    </svg>
  )
}

export default HorizontalIcon
