import { React } from '@/BdApi'
import { useResizeObserver } from '@reactuses/core'
import useForceUpdate from '@/hooks/useForceUpdate'

function getTargetElement (target) {
  if (!target) return undefined
  if (typeof target === 'function') return target()
  if ('current' in target) return target.current
  return target
}

function useElementBounding (target, options = {}) {
  const {
    windowResize = true,
    windowScroll = true,
    immediate = true
  } = options

  const update = useForceUpdate()

  useResizeObserver(target, update)

  React.useLayoutEffect(() => {
    if (immediate) update()
  }, [immediate, update])

  React.useEffect(() => {
    if (windowScroll) window.addEventListener('scroll', update, { passive: true })
    if (windowResize) window.addEventListener('resize', update, { passive: true })

    return () => {
      if (windowScroll) window.removeEventListener('scroll', update)
      if (windowResize) window.removeEventListener('resize', update)
    }
  }, [update, windowResize, windowScroll])

  const bounding = getTargetElement(target)?.getBoundingClientRect()

  const boundingCached = React.useRef()
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
