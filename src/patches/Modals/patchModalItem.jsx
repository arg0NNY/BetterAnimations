import { Patcher } from '@/BdApi'
import { ModalTransitionState } from '@/modules/DiscordModules'
import findInReactTree from '@/utils/findInReactTree'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import Modules from '@/modules/Modules'
import { DiscordClasses } from '@/modules/DiscordSelectors'

function patchModalItem (component) {
  injectModule(component, ModuleKey.Modals)
  Patcher.after(component.prototype, 'render', (self, args, value) => {
    const module = Modules.getModule(ModuleKey.Modals)
    if (!module.isEnabled()) return

    const container = findInReactTree(value, m => m?.type === 'div')
    if (container) container.props.ref = self.props.layerRef

    // Disable Discord's internal modal animations
    const props = findInReactTree(value, m => 'transitionState' in (m ?? {}))
    if (props) props.transitionState = ModalTransitionState.ENTERED
  })
}

export default patchModalItem
