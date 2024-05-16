import { Patcher } from '@/BdApi'
import { Easing, ModalBackdrop, ReactSpring } from '@/modules/DiscordModules'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'

function patchModalBackdrop () {
  let renderRunning = false

  Patcher.before(ModalBackdrop.default, 'render', () => {
    const module = useModule(ModuleKey.Modals)
    if (!module.isEnabled()) return

    renderRunning = module.getGeneralSettings()
  })
  Patcher.after(ModalBackdrop.default, 'render', () => { renderRunning = false })

  Patcher.before(ReactSpring, 'useTransition', (self, [_, { config }]) => {
    if (!renderRunning || config.duration === 0) return

    config.duration = renderRunning.backdropTransitionDuration ?? 200
    config.easing = Easing.inOut(Easing.sin)
  })
}

export default patchModalBackdrop
