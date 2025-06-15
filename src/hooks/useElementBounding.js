import useResizeObserver from '@/hooks/useResizeObserver'
import useUpdate from '@/hooks/useUpdate'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { getTargetElement } from '@utils/domTarget'

function useElementBounding (target, options = {}) {
  const {
    windowResize = true,
    windowScroll = true,
    immediate = true
  } = options

  const update = useUpdate()

  useResizeObserver(target, update)

  useLayoutEffect(() => {
    if (immediate) update()
  }, [immediate, update])

  useEffect(() => {
    if (windowScroll) window.addEventListener('scroll', update, { passive: true })
    if (windowResize) window.addEventListener('resize', update, { passive: true })

    return () => {
      if (windowScroll) window.removeEventListener('scroll', update)
      if (windowResize) window.removeEventListener('resize', update)
    }
  }, [update, windowResize, windowScroll])

  const bounding = getTargetElement(target)?.getBoundingClientRect()

  const boundingCached = useRef()
  if (bounding) boundingCached.current = bounding

  return {
    top: bounding?.top ?? boundingCached.current?.top ?? 0,
    left: bounding?.left ?? boundingCached.current?.left ?? 0,
    width: bounding?.width ?? boundingCached.current?.width ?? 0,
    height: bounding?.height ?? boundingCached.current?.height ?? 0,
    update
  }
}

export default useElementBounding
