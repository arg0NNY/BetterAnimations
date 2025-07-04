import Patcher from '@/modules/Patcher'
import { ModalTransitionState } from '@discord/modules'
import findInReactTree from '@/utils/findInReactTree'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import Modules from '@/modules/Modules'
import { MainWindowOnly } from '@/hooks/useWindow'
import { ErrorBoundary } from '@error/boundary'

function patchModalItem (component) {
  injectModule(component, ModuleKey.Modals)
  Patcher.after(ModuleKey.Modals, component.prototype, 'render', (self, args, value) => {
    const module = Modules.getModule(ModuleKey.Modals)
    if (!module.isEnabled()) return

    return (
      <ErrorBoundary module={module} fallback={value}>
        <MainWindowOnly fallback={value}>
          {() => {
            const container = findInReactTree(value, m => m?.type === 'div')
            if (container) container.props.ref = self.props.layerRef

            // Disable Discord's internal modal animations
            const props = findInReactTree(value, m => 'transitionState' in (m ?? {}))
            if (props) props.transitionState = ModalTransitionState.ENTERED

            return value
          }}
        </MainWindowOnly>
      </ErrorBoundary>
    )
  })
}

export default patchModalItem
