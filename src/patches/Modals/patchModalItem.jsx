import Patcher from '@/modules/Patcher'
import findInReactTree from '@/utils/findInReactTree'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import Core from '@/modules/Core'
import classNames from 'classnames'

function patchModalItem (component) {
  injectModule(component, ModuleKey.Modals)
  Patcher.after(ModuleKey.Modals, component.prototype, 'render', (self, args, value) => {
    const module = Core.getModule(ModuleKey.Modals)
    if (!module.isEnabled()) return

    const container = findInReactTree(value, m => m?.type === 'div')
    if (!container) return

    container.props.ref = self.props.layerRef
    container.props.className = classNames(container.props.className, {
      'BA__modal--hidden': self.props.hidden
    })
  })
}

export default patchModalItem
