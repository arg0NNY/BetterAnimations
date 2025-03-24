import { useEffect, useRef } from 'react'

function useLatest (value) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref
}

export default useLatest
