import Patcher from '@/modules/Patcher'
import findInReactTree from '@/utils/findInReactTree'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import Modules from '@/modules/Modules'

function patchModalItem (component) {
  injectModule(component, ModuleKey.Modals)
  Patcher.after(ModuleKey.Modals, component.prototype, 'render', (self, args, value) => {
    const module = Modules.getModule(ModuleKey.Modals)
    if (!module.isEnabled()) return

    const container = findInReactTree(value, m => m?.type === 'div')
    if (container) container.props.ref = self.props.layerRef
  })
}

export default patchModalItem
