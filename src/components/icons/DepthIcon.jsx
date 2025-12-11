import useIconSize from '@/hooks/useIconSize'
import { colors } from '@discord/modules'

function DepthIcon ({ size, width, height, color = colors.INTERACTIVE_ICON_DEFAULT }) {
  return (
    <svg
      {...useIconSize(size, { width, height })}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill={typeof color === 'string' ? color : color?.css}
        strokeWidth="2"
        d="M12,22C12,22,12,22,12,22L12,22c-0.5,0-0.9-0.1-1.2-0.2c-0.4-0.2-0.7-0.4-1-0.7l-6.6-6.9c-0.6-0.7-0.2-1.6,0.9-2.2
	c1-0.5,2.4-0.5,3,0l2.5,2l1.2-10.7L9.3,3.7C8.7,3.9,8,3.9,7.6,3.7C7.2,3.5,7.3,3.3,7.8,3.1l3.5-1c0.1,0,0.2-0.1,0.3-0.1
	c0.1,0,0.2,0,0.4,0l0,0c0,0,0,0,0,0l0,0c0.1,0,0.3,0,0.4,0c0.1,0,0.2,0,0.3,0.1l3.5,1c0.5,0.2,0.6,0.4,0.2,0.6
	c-0.4,0.2-1.2,0.2-1.7,0l-1.6-0.5l1.2,10.7l2.5-2c0.7-0.5,2-0.5,3,0c1.1,0.6,1.6,1.5,0.9,2.2l-6.6,6.9c-0.3,0.3-0.6,0.5-1,0.7
	C12.9,21.9,12.5,22,12,22L12,22C12,22,12,22,12,22z"
      />
    </svg>
  )
}

export default DepthIcon
