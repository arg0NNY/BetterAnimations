import useIconSize from '@/hooks/useIconSize'
import { colors } from '@/modules/DiscordModules'

function VerticalIcon ({ size, width, height, color = colors.INTERACTIVE_NORMAL }) {
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
        d="M12 21V3m0 18l3-3m-3 3l-3-3m3-15L9 6m3-3l3 3"
      />
    </svg>
  )
}

export default VerticalIcon
