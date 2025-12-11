import useIconSize from '@/hooks/useIconSize'
import { colors } from '@discord/modules'

function ArrowRightFromLineIcon ({ size, width, height, color = colors.INTERACTIVE_ICON_DEFAULT }) {
  return (
    <svg
      {...useIconSize(size, { width, height })}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke={typeof color === 'string' ? color : color?.css}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 5v14m18-7H7m8 6l6-6l-6-6"
      />
    </svg>
  )
}

export default ArrowRightFromLineIcon
