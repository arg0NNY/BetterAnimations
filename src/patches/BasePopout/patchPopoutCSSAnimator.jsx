import { Patcher } from '@/BdApi'
import { mangled, PopoutCSSAnimator } from '@/modules/DiscordModules'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'

function patchPopoutCSSAnimator () {
  // Disable Discord's internal popout animations
  const Original = mangled(PopoutCSSAnimator)
  Patcher.instead(...PopoutCSSAnimator, (self, [props]) => {
    const module = useModule(ModuleKey.Popouts)
    if (!module.isEnabled()) return <Original {...props} />

    return props?.children
  })
}

export default patchPopoutCSSAnimator
