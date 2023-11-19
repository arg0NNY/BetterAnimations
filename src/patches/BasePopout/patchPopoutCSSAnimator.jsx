import { Patcher } from '@/BdApi'
import { PopoutCSSAnimator } from '@/modules/DiscordModules'

function patchPopoutCSSAnimator () {
  // Disable Discord's popout animations
  Patcher.instead(PopoutCSSAnimator, 'PopoutCSSAnimator', (self, [props]) => {
    return props?.children
  })
}

export default patchPopoutCSSAnimator
