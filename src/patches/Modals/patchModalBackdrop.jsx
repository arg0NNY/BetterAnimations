import { Patcher } from '@/BdApi'
import { ModalBackdrop, ReactSpring } from '@/modules/DiscordModules'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'

function patchModalBackdrop () {
  let renderRunning = false

  Patcher.before(ModalBackdrop.default, 'render', () => {
    const module = useModule(ModuleKey.Modals)
    if (!module.isEnabled()) return

    renderRunning = true
  })
  Patcher.after(ModalBackdrop.default, 'render', () => { renderRunning = false })

  Patcher.before(ReactSpring, 'useTransition', (self, [_, { config }]) => {
    if (!renderRunning || config.duration === 0) return

    config.duration = 200 // TODO: Make this a general setting for Modals module
    config.easing = x => -(Math.cos(Math.PI * x) - 1) / 2 // easeInOutSine
  })
}

export default patchModalBackdrop
