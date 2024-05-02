import { React } from '@/BdApi'
import usePrevious from '@/hooks/usePrevious'

function useDirection (list, current) {
  const prev = usePrevious(current)
  const direction = React.useRef(1)

  if (prev !== current)
    direction.current = +(list.indexOf(prev) < list.indexOf(current))

  return direction.current
}

export default useDirection
