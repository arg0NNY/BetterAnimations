import { Patcher } from '@/BdApi'
import { appLayerContext, Layer, MenuSubmenuItem, MenuSubmenuListItem } from '@/modules/DiscordModules'
import CloneTransition from '@/components/CloneTransition'
import { tempAnimationData } from '@/patches/ContextMenu/patchContextMenu'
import { clearContainingStyles } from '@/helpers/transition'

function patchContextSubmenu () {
  const callback = (self, [props], original) => {
    const value = original(Object.assign({}, props, { isFocused: true }))

    const context = {
      position: 'bottom',
      align: 'left',
      duration: 200
    }

    const i = value.props.children.length - 1
    value.props.children[i] = (
      <Layer layerContext={appLayerContext}>
        <CloneTransition
          in={props.isFocused}
          clone={false}
          animation={tempAnimationData}
          context={context}
          onEntered={clearContainingStyles}
        >
          {value.props.children[i]}
        </CloneTransition>
      </Layer>
    )

    return value
  }

  Patcher.instead(MenuSubmenuItem, 'MenuSubmenuItem', callback)
  Patcher.instead(MenuSubmenuListItem, 'MenuSubmenuListItem', callback)
}

export default patchContextSubmenu
