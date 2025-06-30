import Patcher from '@/modules/Patcher'
import { ProfileEffectsKeyed } from '@discord/modules'
import { use } from 'react'
import { AnimeTransitionContext } from '@components/AnimeTransition'
import useConfig from '@/hooks/useConfig'

function patchProfileEffects () {
  Patcher.after(...ProfileEffectsKeyed, () => {
    const [config] = useConfig()
    if (!config.general.prioritizeAnimationSmoothness) return

    const { state } = use(AnimeTransitionContext)
    if (state === 'entering') return null // Do not load profile effects while entering
  })
}

export default patchProfileEffects
