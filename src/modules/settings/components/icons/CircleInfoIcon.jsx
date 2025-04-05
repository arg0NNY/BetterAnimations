import useIconSize from '@/hooks/useIconSize'
import { colors } from '@/modules/DiscordModules'

function CircleInfoIcon ({ size, width, height, color = colors.INTERACTIVE_NORMAL, secondaryColor = 'transparent' }) {
  return (
    <svg
      {...useIconSize(size, { width, height })}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill={typeof secondaryColor === 'string' ? secondaryColor : secondaryColor.css}
      />
      <path
        fill={typeof color === 'string' ? color : color.css}
        fillRule="evenodd"
        d="M23 12a11 11 0 1 1-22 0 11 11 0 0 1 22 0Zm-9.5-4.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm-.77 3.96a1 1 0 1 0-1.96-.42l-1.04 4.86a2.77 2.77 0 0 0 4.31 2.83l.24-.17a1 1 0 1 0-1.16-1.62l-.24.17a.77.77 0 0 1-1.2-.79l1.05-4.86Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default CircleInfoIcon
