import useIconSize from '@/hooks/useIconSize'
import { colors } from '@/modules/DiscordModules'

function CollapseListIcon ({ size, width, height, color = colors.INTERACTIVE_NORMAL }) {
  return (
    <svg
      {...useIconSize(size, { width, height })}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill={typeof color === 'string' ? color : color.css}
        fillRule="evenodd"
        d="M7.3 2.3a1 1 0 0 1 1.4 0L12 5.58l3.3-3.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.42ZM2 12a1 1 0 0 1 1-1h18a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1ZM8.7 21.7a1 1 0 0 1-1.4-1.4l4-4a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1-1.4 1.4L12 18.42l-3.3 3.3Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default CollapseListIcon
