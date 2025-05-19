import { useCallback, useRef } from 'react'
import useLatest from '@/hooks/useLatest'
import useDeepCompareEffect from '@/hooks/useDeepCompareEffect'
import { getTargetElement } from '@shared/utils/domTarget'

function useResizeObserver (target, callback, options = {}) {
  const savedCallback = useLatest(callback)
  const observerRef = useRef()

  const stop = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }
  }, [])
  useDeepCompareEffect(() => {
    const element = getTargetElement(target)
    if (!element) {
      return
    }
    observerRef.current = new ResizeObserver(savedCallback.current)
    observerRef.current.observe(element, options)

    return stop
  }, [savedCallback, stop, target, options])

  return stop
}

export default useResizeObserver
