import useLatest from '@/hooks/useLatest'
import useDeepCompareEffect from '@/hooks/useDeepCompareEffect'
import { getTargetElement } from '@utils/domTarget'
import { off, on } from '@utils/browser'

function useEventListener (eventName, handler, element, options) {
  const savedHandler = useLatest(handler)

  useDeepCompareEffect(() => {
    const targetElement = getTargetElement(element, window)
    if (!(targetElement && targetElement.addEventListener)) {
      return
    }

    const eventListener = event => savedHandler.current(event)

    on(targetElement, eventName, eventListener, options)

    return () => {
      if (!(targetElement && targetElement.removeEventListener)) {
        return
      }
      off(targetElement, eventName, eventListener)
    }
  }, [eventName, element, options])
}

export default useEventListener
