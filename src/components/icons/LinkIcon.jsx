import useIconSize from '@/hooks/useIconSize'
import { colors } from '@discord/modules'

function LinkIcon ({ size, width, height, color = colors.INTERACTIVE_NORMAL }) {
  return (
    <svg
      {...useIconSize(size, { width, height })}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill={typeof color === 'string' ? color : color.css}
        d="M16.32 14.72a1 1 0 0 1 0-1.41l2.51-2.51a3.98 3.98 0 0 0-5.62-5.63l-2.52 2.51a1 1 0 0 1-1.41-1.41l2.52-2.52a5.98 5.98 0 0 1 8.45 8.46l-2.52 2.51a1 1 0 0 1-1.41 0ZM7.68 9.29a1 1 0 0 1 0 1.41l-2.52 2.51a3.98 3.98 0 1 0 5.63 5.63l2.51-2.52a1 1 0 0 1 1.42 1.42l-2.52 2.51a5.98 5.98 0 0 1-8.45-8.45l2.51-2.51a1 1 0 0 1 1.42 0Z"
      />
      <path
        fill={typeof color === 'string' ? color : color.css}
        d="M14.7 10.7a1 1 0 0 0-1.4-1.4l-4 4a1 1 0 1 0 1.4 1.4l4-4Z"
      />
    </svg>
  )
}

export default LinkIcon
