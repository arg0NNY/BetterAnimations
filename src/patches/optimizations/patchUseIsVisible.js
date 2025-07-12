import Patcher from '@/modules/Patcher'
import { useIsVisibleKeyed } from '@discord/modules'
import { useCallback, useEffect, useRef } from 'react'
import useConfig from '@/hooks/useConfig'
import InternalError from '@error/structs/InternalError'
import store from '@animation/store'

/**
 * Commit the `IntersectionObserver` state after animations are finished
 */
function patchUseIsVisible () {
  Patcher.instead(...useIsVisibleKeyed, (self, [callback, ...args], original) => {
    const { config } = useConfig()
    const isEnabled = config.general.prioritizeAnimationSmoothness

    const unwatch = useRef()

    const onUpdate = useCallback(isIntersecting => {
      unwatch.current?.()
      if (store.isSafe) callback(isIntersecting)
      else unwatch.current = store.onceSafe(() => callback(isIntersecting))
    }, [callback])

    useEffect(() => () => unwatch.current?.(), [])

    return original(isEnabled ? onUpdate : callback, ...args)
  }, { category: InternalError.Category.PRIORITIZE_ANIMATION_SMOOTHNESS })
}

export default patchUseIsVisible
