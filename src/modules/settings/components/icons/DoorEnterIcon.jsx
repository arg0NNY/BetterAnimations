import useIconSize from '@/hooks/useIconSize'
import { colors } from '@discord/modules'

function DoorEnterIcon ({ size, width, height, color = colors.INTERACTIVE_NORMAL }) {
  return (
    <svg
      {...useIconSize(size, { width, height })}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill={typeof color === 'string' ? color : color.css}
        d="M9 12a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1Z"
      />
      <path
        fill={typeof color === 'string' ? color : color.css}
        fillRule="evenodd"
        d="M2.75 3.02A3 3 0 0 1 5 2h10a3 3 0 0 1 3 3v7.5a.5.5 0 0 1-.5.5H16a3 3 0 0 0-3 3v3.5a2.5 2.5 0 0 1-3.68 2.2l-5.8-3.09A3 3 0 0 1 2 16V5a3 3 0 0 1 .76-1.98Zm1.3 1.95A.04.04 0 0 0 4 5v11c0 .36.2.68.49.86l5.77 3.08a.5.5 0 0 0 .74-.44V8.02a.5.5 0 0 0-.32-.46l-6.63-2.6Z"
        clipRule="evenodd"
      />
      <path
        fill={typeof color === 'string' ? color : color.css}
        d="M15 18.5V22a1 1 0 1 0 2 0v-3.59l4.3 4.3a1 1 0 0 0 1.4-1.42L18.42 17H22a1 1 0 1 0 0-2h-6a1 1 0 0 0-1 1v2.5Z"
      />
    </svg>
  )
}

export default DoorEnterIcon
