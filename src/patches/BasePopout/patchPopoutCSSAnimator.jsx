import Patcher from '@/modules/Patcher'
import { PopoutCSSAnimatorKeyed } from '@discord/modules'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import useWindow from '@/hooks/useWindow'

function patchPopoutCSSAnimator () {
  // Disable Discord's internal popout animations
  Patcher.instead(ModuleKey.Popouts, ...PopoutCSSAnimatorKeyed, (self, [props], original) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Popouts)
    if (!isMainWindow || !module.isEnabled()) return original(props)

    return props?.children
  })
}

export default patchPopoutCSSAnimator
