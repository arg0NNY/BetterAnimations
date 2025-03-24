import { useCallback, useEffect, useMemo, useRef } from 'react'
import useLatest from '@/hooks/useLatest'

function useRafFn (callback, initiallyActive = true) {
  const raf = useRef(null)
  const rafActivity = useRef(false)
  const rafCallback = useLatest(callback)

  const step = useCallback(
    time => {
      if (rafActivity.current) {
        rafCallback.current(time)
        raf.current = requestAnimationFrame(step)
      }
    },
    [rafCallback]
  )

  const result = useMemo(
    () =>
      [
        () => {
          // stop
          if (rafActivity.current) {
            rafActivity.current = false
            raf.current && cancelAnimationFrame(raf.current)
          }
        },
        () => {
          // start
          if (!rafActivity.current) {
            rafActivity.current = true
            raf.current = requestAnimationFrame(step)
          }
        },
        () => rafActivity.current // isActive
      ],
    [step]
  )

  useEffect(() => {
    if (initiallyActive) {
      result[1]()
    }

    return result[0]
  }, [initiallyActive, result])

  return result
}

export default useRafFn
