import { useCallback, useState } from 'react'
import useEventListener from '@/hooks/useEventListener'

function useHover (target) {
  const [hovered, setHovered] = useState(false)

  const onMouseEnter = useCallback(() => setHovered(true), [])
  const onMouseLeave = useCallback(() => setHovered(false), [])

  useEventListener('mouseenter', onMouseEnter, target)
  useEventListener('mouseleave', onMouseLeave, target)

  return hovered
}

export default useHover
