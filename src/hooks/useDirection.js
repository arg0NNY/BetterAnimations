import usePrevious from '@/hooks/usePrevious'
import { useRef } from 'react'

function useDirection (list, current) {
  const prev = usePrevious(current)
  const direction = useRef(1)

  if (prev !== current)
    direction.current = +(list.indexOf(prev) < list.indexOf(current))

  return direction.current
}

export default useDirection
