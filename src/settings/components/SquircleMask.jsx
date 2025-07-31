
function SquircleMask ({ children, size = 40, ...props }) {
  return (
    <svg
      {...props}
      height={size}
      width={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <foreignObject
        x={0}
        y={0}
        height={size}
        width={size}
        overflow="visible"
        mask="url(#svg-mask-squircle)"
      >
        {children}
      </foreignObject>
    </svg>
  )
}

export default SquircleMask
