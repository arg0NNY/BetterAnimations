import { React } from '@/BdApi'

function AnimeContainer ({ container, children }, ref) {
  if (!container) return children

  return (
    <div data-animation-container="" ref={ref} {...container}>{children}</div>
  )
}

export default React.forwardRef(AnimeContainer)
