import Patcher from '@/modules/Patcher'
import { PopoutCSSAnimatorKeyed } from '@/modules/DiscordModules'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import { unkeyed } from '@/utils/webpack'
import useWindow from '@/hooks/useWindow'

function patchPopoutCSSAnimator () {
  // Disable Discord's internal popout animations
  const Original = unkeyed(PopoutCSSAnimatorKeyed)
  Patcher.instead(...PopoutCSSAnimatorKeyed, (self, [props]) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Popouts)
    if (!isMainWindow || !module.isEnabled()) return <Original {...props} />

    return props?.children
  })
}

export default patchPopoutCSSAnimator
