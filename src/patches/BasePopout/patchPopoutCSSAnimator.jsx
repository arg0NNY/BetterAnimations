import Patcher from '@/modules/Patcher'
import { PopoutCSSAnimatorKeyed } from '@/modules/DiscordModules'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import { unkeyed } from '@/utils/webpack'

function patchPopoutCSSAnimator () {
  // Disable Discord's internal popout animations
  const Original = unkeyed(PopoutCSSAnimatorKeyed)
  Patcher.instead(...PopoutCSSAnimatorKeyed, (self, [props]) => {
    const module = useModule(ModuleKey.Popouts)
    if (!module.isEnabled()) return <Original {...props} />

    return props?.children
  })
}

export default patchPopoutCSSAnimator
