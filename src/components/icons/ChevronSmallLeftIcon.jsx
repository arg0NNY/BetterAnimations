import useIconSize from '@/hooks/useIconSize'
import { colors } from '@discord/modules'

function ChevronSmallLeftIcon ({ size, width, height, color = colors.INTERACTIVE_NORMAL }) {
  return (
    <svg
      {...useIconSize(size, { width, height })}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill={typeof color === 'string' ? color : color.css}
        d="M14.7 5.3a1 1 0 0 1 0 1.4L9.42 12l5.3 5.3a1 1 0 0 1-1.42 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.42 0Z"
      />
    </svg>
  )
}

export default ChevronSmallLeftIcon
