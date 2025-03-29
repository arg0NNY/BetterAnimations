import { forwardRef } from 'react'

function AnimeContainer ({ container, children }, ref) {
  if (!container) return children
  const { defaultLayoutStyles, ...props } = container

  return (
    <div
      ref={ref}
      data-animation-container=""
      data-default-layout-styles={defaultLayoutStyles}
      {...props}
    >
      {children}
    </div>
  )
}

export default forwardRef(AnimeContainer)
