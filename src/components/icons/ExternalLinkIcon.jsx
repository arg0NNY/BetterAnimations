import useIconSize from '@/hooks/useIconSize'
import { colors } from '@discord/modules'

function ExternalLinkIcon ({ size, width, height, color = colors.INTERACTIVE_ICON_DEFAULT }) {
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
        d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
      />
    </svg>
  )
}

export default ExternalLinkIcon
