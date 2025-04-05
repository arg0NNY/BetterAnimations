import useIconSize from '@/hooks/useIconSize'

function IconAuthor ({ size, width, height, ...props }) {
  return (
    <svg
      {...props}
      {...useIconSize(size, { width, height })}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 605.59 605.59"
    >
      <defs>
        <radialGradient id="BA__iconAuthorGradient" cx="80.46" cy="598.46" r="722.91" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f9ed32"/>
          <stop offset="0.66" stopColor="#ee2a7b"/>
          <stop offset="1" stopColor="#002aff"/>
        </radialGradient>
      </defs>
      <path
        d="M188.5,208.37c-41.6,50.39-46.19,124.39-6.63,180.17,47.28,66.69,140,82.47,206.67,35.19s82.47-140,35.19-206.68c-39.56-55.79-110.91-75.94-172.22-53.35L205.8,99.23c97.09-46.32,216.63-17.54,280.93,73.14,71.92,101.42,47.91,242.45-53.51,314.36s-242.44,47.91-314.36-53.51c-47.43-66.89-53.13-151-22.42-221.15l-50-70.55A303.4,303.4,0,1,0,127.7,55.85,309.89,309.89,0,0,0,97.6,80.18Zm73.22,36.5a71,71,0,1,1-16.85,99A71.09,71.09,0,0,1,261.72,244.87Z"
        fill="url(#BA__iconAuthorGradient)"
      />
    </svg>
  )
}

export default IconAuthor
