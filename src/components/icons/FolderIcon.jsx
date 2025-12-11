import useIconSize from '@/hooks/useIconSize'
import { colors } from '@discord/modules'

function FolderIcon ({ size, width, height, color = colors.INTERACTIVE_ICON_DEFAULT }) {
  return (
    <svg
      {...useIconSize(size, { width, height })}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill={typeof color === 'string' ? color : color.css}
        d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
      />
    </svg>
  )
}

export default FolderIcon
