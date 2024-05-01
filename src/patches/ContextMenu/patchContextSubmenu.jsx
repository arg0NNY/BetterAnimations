import { Patcher } from '@/BdApi'
import { appLayerContext, Layer, MenuSubmenuItem, MenuSubmenuListItem } from '@/modules/DiscordModules'
import AnimeTransition from '@/components/AnimeTransition'
import { tempAnimationData } from '@/patches/ContextMenu/patchContextMenu'
import { clearContainingStyles } from '@/helpers/transition'
import Position from '@/enums/Position'

function patchContextSubmenu () {
  const callback = (self, [props], original) => {
    const value = original(Object.assign({}, props, { isFocused: true }))

    const context = {
      position: Position.BottomLeft,
      duration: 200
    }

    const i = value.props.children.length - 1
    value.props.children[i] = (
      <Layer layerContext={appLayerContext}>
        <AnimeTransition
          in={props.isFocused}
          animation={tempAnimationData}
          context={context}
          onEntered={clearContainingStyles}
        >
          {value.props.children[i]}
        </AnimeTransition>
      </Layer>
    )

    return value
  }

  Patcher.instead(MenuSubmenuItem, 'MenuSubmenuItem', callback)
  Patcher.instead(MenuSubmenuListItem, 'MenuSubmenuListItem', callback)
}

export default patchContextSubmenu
