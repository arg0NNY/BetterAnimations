import useIconSize from '@/modules/settingsRefresh/hooks/useIconSize'
import { colors } from '@/modules/DiscordModules'

function BookCheckIcon ({ size, width, height, color = colors.INTERACTIVE_NORMAL }) {
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
        d="M15 2a3 3 0 0 1 3 3v12H5.5a1.5 1.5 0 0 0 0 3h14a.5.5 0 0 0 .5-.5V5h1a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h10Zm-.3 5.7a1 1 0 0 0-1.4-1.4L9 10.58l-2.3-2.3a1 1 0 0 0-1.4 1.42l3 3a1 1 0 0 0 1.4 0l5-5Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default BookCheckIcon
