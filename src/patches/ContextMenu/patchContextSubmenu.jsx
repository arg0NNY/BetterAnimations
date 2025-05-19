import Patcher from '@/modules/Patcher'
import {
  appLayerContext,
  Layer,
  MenuSubmenuItemKeyed,
  MenuSubmenuListItemKeyed,
  Timeout
} from '@/modules/DiscordModules'
import AnimeTransition from '@/components/AnimeTransition'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import Position from '@enums/Position'
import useAutoPosition from '@/hooks/useAutoPosition'
import { useEffect, useMemo, useRef, useState } from 'react'
import useWindow from '@/hooks/useWindow'

function patchContextSubmenu () {
  const callback = (self, [props], original) => {
    const layerRef = useRef()
    const { autoRef, setPosition } = useAutoPosition(Position.Right)

    const timeout = useMemo(() => new Timeout(), [])

    const [isFocused, setIsFocused] = useState(props.isFocused)
    useEffect(() => {
      if (props.isFocused) timeout.start(20, () => setIsFocused(true))
      else {
        timeout.stop()
        setIsFocused(false)
      }
    }, [props.isFocused])

    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.ContextMenu)
    if (!isMainWindow || !module.isEnabled()) return original(props)

    const value = original(Object.assign({}, props, { isFocused: true }))
    const { children } = value.props

    const i = children.length - 1
    if (!children[i]) return value

    children[i].props.onPositionChange = setPosition
    children[i].props.ref = layerRef
    children[i] = (
      <AnimeTransition
        in={isFocused}
        layerRef={layerRef}
        module={module}
        autoRef={autoRef}
        anchor={value.props.ref}
      >
        <Layer layerContext={appLayerContext}>
          {children[i]}
        </Layer>
      </AnimeTransition>
    )

    return value
  }

  Patcher.instead(...MenuSubmenuItemKeyed, callback)
  Patcher.instead(...MenuSubmenuListItemKeyed, callback)
}

export default patchContextSubmenu
