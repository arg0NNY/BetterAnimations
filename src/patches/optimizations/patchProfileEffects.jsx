import Patcher from '@/modules/Patcher'
import { ProfileEffectsKeyed } from '@discord/modules'
import { use } from 'react'
import { AnimeTransitionContext } from '@components/AnimeTransition'
import useConfig from '@/hooks/useConfig'
import InternalError from '@error/structs/InternalError'

/**
 * Load profile effects after enter animations are finished
 */
function patchProfileEffects () {
  Patcher.after(...ProfileEffectsKeyed, () => {
    const { config } = useConfig()
    const { isEnterActive } = use(AnimeTransitionContext)

    if (config.general.prioritizeAnimationSmoothness && isEnterActive) return null
  }, { category: InternalError.Category.PRIORITIZE_ANIMATION_SMOOTHNESS })
}

export default patchProfileEffects
