import { React } from '@/BdApi'
import Direction from '@/enums/Direction'
import usePrevious from '@/hooks/usePrevious'

function useDirection (list, current) {
  const prev = usePrevious(current)
  const direction = React.useRef(Direction.Upwards)

  if (prev !== current)
    direction.current = list.indexOf(prev) < list.indexOf(current) ? Direction.Upwards : Direction.Downwards

  return direction.current
}

export default useDirection
