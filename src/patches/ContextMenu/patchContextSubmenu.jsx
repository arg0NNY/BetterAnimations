import Patcher from '@/modules/Patcher'
import {
  MenuSubmenuItemKeyed,
  MenuSubmenuListItemKeyed,
} from '@discord/modules'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import useWindow from '@/hooks/useWindow'
import { ErrorBoundary } from '@error/boundary'
import AnimeFloating from '@/components/AnimeFloating'

function patchContextSubmenu () {
  const callback = (self, [props], value) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.ContextMenu)
    if (!isMainWindow || !module.isEnabled()) return

    return (
      <ErrorBoundary module={module} fallback={value}>
        <AnimeFloating
          {...value.props}
          module={module}
        />
      </ErrorBoundary>
    )
  }

  Patcher.after(ModuleKey.ContextMenu, ...MenuSubmenuItemKeyed, callback)
  Patcher.after(ModuleKey.ContextMenu, ...MenuSubmenuListItemKeyed, callback)
}

export default patchContextSubmenu
