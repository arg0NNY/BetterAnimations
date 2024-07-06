import { React } from '@/BdApi'

function usePrevious (value) {
  const ref = React.useRef(value)
  React.useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

export default usePrevious
