import { Patcher } from '@/BdApi'
import { ModalComponents } from '@/modules/DiscordModules'
import findInReactTree from '@/helpers/findInReactTree'

function patchModalRoot () {
  // Disable Discord's internal modal animations
  Patcher.after(ModalComponents, 'ModalRoot', (self, args, value) => {
    const animated = findInReactTree(value, m => m?.type?.displayName?.startsWith('Animated'))
    if (!animated) return

    delete animated.props.style
    animated.type = 'div'
  })
}

export default patchModalRoot
