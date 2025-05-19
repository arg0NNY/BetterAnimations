import Patcher from '@/modules/Patcher'
import { ModalTransitionState } from '@/modules/DiscordModules'
import findInReactTree from '@/utils/findInReactTree'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@shared/enums/ModuleKey'
import Modules from '@/modules/Modules'
import { MainWindowOnly } from '@/hooks/useWindow'

function patchModalItem (component) {
  injectModule(component, ModuleKey.Modals)
  Patcher.after(component.prototype, 'render', (self, args, value) => {
    const module = Modules.getModule(ModuleKey.Modals)
    if (!module.isEnabled()) return

    return (
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
    )
  })
}

export default patchModalItem
