import Patcher, { TinyPatcher } from '@/modules/Patcher'
import { ContextMenuKeyed, TransitionGroup } from '@discord/modules'
import patchContextSubmenu from '@/patches/ContextMenu/patchContextSubmenu'
import ensureOnce from '@utils/ensureOnce'
import useModule, { injectModule } from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import Core from '@/modules/Core'
import useWindow from '@/hooks/useWindow'
import { ErrorBoundary } from '@error/boundary'
import AnimeFloating from '@/components/AnimeFloating'

function patchContextMenu () {
  const once = ensureOnce()
  let patchedFloating = null

  Patcher.after(ModuleKey.ContextMenu, ...ContextMenuKeyed, (self, args, value) => {
    once(() => {
      injectModule(value?.type, ModuleKey.ContextMenu)
      Patcher.after(ModuleKey.ContextMenu, value?.type?.prototype, 'render', (self, args, value) => {
        const module = Core.getModule(ModuleKey.ContextMenu)
        if (!module.isEnabled() || !value) return

        value.props.in = self.props.in
        value.props.onExited = self.props.onExited
        if (patchedFloating) {
          value.type = patchedFloating
        }
        else {
          TinyPatcher.after(ModuleKey.ContextMenu, value, 'type', (self, [props], value) => {
            return (
              <AnimeFloating
                {...value.props}
                in={props.in}
                onExited={props.onExited}
                module={module}
                debug={true}
              />
            )
          })
          patchedFloating = value.type
        }
      })
    })

    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.ContextMenu)
    if (!isMainWindow || !module.isEnabled()) return

    return (
      <ErrorBoundary module={module} fallback={value}>
        <TransitionGroup component={null}>
          {value.props.isOpen && value}
        </TransitionGroup>
      </ErrorBoundary>
    )
  })

  patchContextSubmenu()
}

export default patchContextMenu
