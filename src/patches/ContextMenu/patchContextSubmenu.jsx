import Patcher from '@/modules/Patcher'
import {
  appLayerContext,
  AppLayer,
  MenuSubmenuItemKeyed,
  MenuSubmenuListItemKeyed,
  Timeout
} from '@discord/modules'
import AnimeTransition from '@components/AnimeTransition'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import Position from '@enums/Position'
import useAutoPosition from '@/hooks/useAutoPosition'
import { cloneElement, useEffect, useMemo, useRef, useState } from 'react'
import useWindow from '@/hooks/useWindow'
import { ErrorBoundary } from '@error/boundary'
import AnimeFloating from '@/components/AnimeFloating'

// TODO: Check whether forcibly enabled portal is needed
function patchContextSubmenu () {
  const callback = (self, [props], original) => {
    // const layerRef = useRef()
    // const { autoRef, setPosition } = useAutoPosition(Position.Right)
    //
    // const timeout = useMemo(() => new Timeout(), [])
    //
    // const [isFocused, setIsFocused] = useState(props.isFocused)
    // useEffect(() => {
    //   if (props.isFocused) timeout.start(20, () => setIsFocused(true))
    //   else {
    //     timeout.stop()
    //     setIsFocused(false)
    //   }
    // }, [props.isFocused])

    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.ContextMenu)
    const value = original(props)
    if (!isMainWindow || !module.isEnabled()) return value

    return (
      <ErrorBoundary module={module} fallback={value}>
        <AnimeFloating
          {...value.props}
          module={module}
        />
      </ErrorBoundary>
    )
  }

  // TODO: change to after?
  Patcher.instead(ModuleKey.ContextMenu, ...MenuSubmenuItemKeyed, callback)
  Patcher.instead(ModuleKey.ContextMenu, ...MenuSubmenuListItemKeyed, callback)
}

export default patchContextSubmenu
