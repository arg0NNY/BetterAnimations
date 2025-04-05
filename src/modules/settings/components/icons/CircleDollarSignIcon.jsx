import useIconSize from '@/hooks/useIconSize'
import { colors } from '@/modules/DiscordModules'

function CircleDollarSignIcon ({ size, width, height, color = colors.INTERACTIVE_NORMAL }) {
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
        <circle cx="12" cy="12" r="10" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8m4 2V6" />
      </g>
    </svg>
  )
}

export default CircleDollarSignIcon
