import { React } from '@/BdApi'

function usePrevious (value) {
  const prev = React.useRef(value)

  const prevSnapshot = prev.current
  prev.current = value

  return prevSnapshot
}

export default usePrevious
