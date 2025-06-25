import useIconSize from '@/hooks/useIconSize'

function IconAuthor ({ size, width, height, ...props }) {
  return (
    <svg
      {...props}
      {...useIconSize(size, { width, height })}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 678 678"
    >
      <defs>
        <radialGradient id="BA__iconAuthorGradient" cx="90.13" cy="669.95" r="809.18" gradientTransform="matrix(-0.1, -0.99, -0.99, 0.1, 711.72, 640.54)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f9ed32" />
          <stop offset="0.66" stopColor="#ee2a7b" />
          <stop offset="1" stopColor="#002aff" />
        </radialGradient>
      </defs>
      <path
        d="M583.89,526.07a33.47,33.47,0,0,0,45-11.69q2.84-4.69,5.53-9.49A338.85,338.85,0,0,0,247.38,12.77a338.85,338.85,0,0,0-74.27,621.69,339.76,339.76,0,0,0,353.77-13.27,16.78,16.78,0,0,0-1.11-28.6L480.13,567a33.78,33.78,0,0,0-31.25-.86c-72.77,35.08-161.16,34.86-236.44-8.74-119.18-69-160.94-222.16-93.38-342.18C187.26,94,341.3,50.83,462.57,118.92c102,57.28,148.84,175.34,120.71,283.6a16.77,16.77,0,0,1-24.45,10.33l-38.12-21.4a33.51,33.51,0,0,1-16.92-33.06C511.47,292.38,478.88,225,416,192c-75.58-39.67-175.43-11.64-219.32,61.57-48.18,80.39-20.14,184.51,61,230.09,60.08,33.73,132.39,25.91,183.57-14.08a33.54,33.54,0,0,1,37.05-2.78ZM297.36,406.71A79.49,79.49,0,1,1,400.7,389.12,79.57,79.57,0,0,1,297.36,406.71Z"
        fill="url(#BA__iconAuthorGradient)"
      />
    </svg>
  )
}

export default IconAuthor
