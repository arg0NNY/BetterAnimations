import Patcher from '@/modules/Patcher'
import { useIsVisibleKeyed } from '@discord/modules'
import { use, useEffect, useState } from 'react'
import { AnimeTransitionContext } from '@components/AnimeTransition'
import useConfig from '@/hooks/useConfig'

/**
 * Commit the `IntersectionObserver` state after animations are finished
 */
function patchUseIsVisible () {
  Patcher.instead(...useIsVisibleKeyed, (self, [callback, ...args], original) => {
    const { config } = useConfig()
    const isEnabled = config.general.prioritizeAnimationSmoothness

    const { isActive } = use(AnimeTransitionContext)
    const [isIntersecting, setIsIntersecting] = useState(false)

    useEffect(() => {
      if (isEnabled && !isActive) callback(isIntersecting)
    }, [isEnabled, isActive, isIntersecting])

    return original(isEnabled ? setIsIntersecting : callback, ...args)
  })
}

export default patchUseIsVisible
