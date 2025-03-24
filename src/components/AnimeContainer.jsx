import { forwardRef } from 'react'

function AnimeContainer ({ container, children }, ref) {
  if (!container) return children

  return (
    <div data-animation-container="" ref={ref} {...container}>{children}</div>
  )
}

export default forwardRef(AnimeContainer)
