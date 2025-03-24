import { Patcher } from '@/BdApi'
import { Common } from '@/modules/DiscordModules'
import findInReactTree from '@/utils/findInReactTree'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import Modules from '@/modules/Modules'

function patchModalItem (component) {
  injectModule(component, ModuleKey.Modals)
  Patcher.after(component.prototype, 'render', (self, args, value) => {
    const module = Modules.getModule(ModuleKey.Modals)
    if (!module.isEnabled()) return

    // Disable Discord's internal modal animations
    const props = findInReactTree(value, m => 'transitionState' in (m ?? {}))
    if (props) props.transitionState = Common.ModalTransitionState.ENTERED
  })
}

export default patchModalItem
