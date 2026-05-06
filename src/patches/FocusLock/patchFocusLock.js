import Patcher from '@/modules/Patcher'
import { useFocusLockKeyed, Transition } from '@discord/modules'
import { use } from 'react'
import { AnimeTransitionContext } from '@components/AnimeTransition'

/**
 * Release focus lock during exit animations
 */
function patchFocusLock() {
  Patcher.before(...useFocusLockKeyed, (self, args) => {
    const { isEnterActive, tree } = use(AnimeTransitionContext)
    if (
      isEnterActive
        || tree.every(item => [Transition.ENTERING, Transition.ENTERED].includes(item.state))
    ) return

    args[1] ??= {}
    args[1].disable = true
  })
}

export default patchFocusLock
