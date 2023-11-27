import { Patcher } from '@/BdApi'
import { ModalBackdrop, ReactSpring } from '@/modules/DiscordModules'

function patchModalBackdrop () {
  let renderRunning = false

  Patcher.before(ModalBackdrop.default, 'render', () => { renderRunning = true })
  Patcher.after(ModalBackdrop.default, 'render', () => { renderRunning = false })

  Patcher.before(ReactSpring, 'useTransition', (self, [_, { config }]) => {
    if (!renderRunning || config.duration === 0) return

    config.duration = 200
    config.easing = x => -(Math.cos(Math.PI * x) - 1) / 2 // easeInOutSine
  })
}

export default patchModalBackdrop
