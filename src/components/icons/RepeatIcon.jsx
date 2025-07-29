import useIconSize from '@/hooks/useIconSize'
import { colors } from '@discord/modules'

function RepeatIcon ({ size, width, height, color = colors.INTERACTIVE_NORMAL }) {
  return (
    <svg
      {...useIconSize(size, { width, height })}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <g
        fill="none"
        stroke={typeof color === 'string' ? color : color.css}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="m17 2l4 4l-4 4" />
        <path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4l4-4" />
        <path d="M21 13v1a4 4 0 0 1-4 4H3" />
      </g>
    </svg>
  )
}

export default RepeatIcon
