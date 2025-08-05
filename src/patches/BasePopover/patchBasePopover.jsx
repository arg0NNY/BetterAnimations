import Patcher, { TinyPatcher } from '@/modules/Patcher'
import { BasePopoverKeyed } from '@discord/modules'
import ModuleKey from '@enums/ModuleKey'
import findInReactTree from '@/utils/findInReactTree'
import useWindow from '@/hooks/useWindow'
import useModule from '@/hooks/useModule'

/**
 * Disable Discord's internal animations for Mana Popovers
 *
 * (They are absolute garbage btw)
 */
function patchBasePopover () {
  Patcher.after(ModuleKey.Popouts, ...BasePopoverKeyed, (self, [{ shouldShow = true }], value) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Popouts)
    if (!isMainWindow || !module.isEnabled()) return

    value.props.shouldShow = shouldShow

    TinyPatcher.after(value.props, 'renderPopout', (self, args, value) => {
      const animated = findInReactTree(value, m => m?.type?.displayName?.startsWith('Animated'))
      if (!animated) return

      delete animated.props.style
      animated.type = 'div'
    })
  })
}

export default patchBasePopover
