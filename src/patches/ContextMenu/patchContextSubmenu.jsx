import { Patcher } from '@/BdApi'
import { appLayerContext, Layer, MenuSubmenuItemKeyed, MenuSubmenuListItemKeyed } from '@/modules/DiscordModules'
import AnimeTransition from '@/components/AnimeTransition'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import Position from '@/enums/Position'
import useAutoPosition from '@/hooks/useAutoPosition'
import { avoidClickTrap } from '@/utils/transition'

function patchContextSubmenu () {
  const callback = (self, [props], original) => {
    const { autoRef, setPosition } = useAutoPosition(Position.Right)

    const module = useModule(ModuleKey.ContextMenu)
    if (!module.isEnabled()) return original(props)

    const value = original(Object.assign({}, props, { isFocused: true }))
    const { children } = value.props

    const i = children.length - 1
    if (!children[i]) return value

    children[i].props.onPositionChange = setPosition
    children[i] = (
      <AnimeTransition
        in={props.isFocused}
        targetContainer={avoidClickTrap}
        module={module}
        autoRef={autoRef}
        anchor={value.ref}
      >
        <Layer layerContext={appLayerContext}>
          {value.props.children[i]}
        </Layer>
      </AnimeTransition>
    )

    return value
  }

  Patcher.instead(...MenuSubmenuItemKeyed, callback)
  Patcher.instead(...MenuSubmenuListItemKeyed, callback)
}

export default patchContextSubmenu
