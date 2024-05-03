import { Patcher } from '@/BdApi'
import { appLayerContext, Layer, MenuSubmenuItem, MenuSubmenuListItem } from '@/modules/DiscordModules'
import AnimeTransition from '@/components/AnimeTransition'
import { clearContainingStyles } from '@/helpers/transition'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import { animationOptions } from '@/patches/ContextMenu/patchContextMenu'

function patchContextSubmenu () {
  const callback = (self, [props], original) => {
    const module = useModule(ModuleKey.ContextMenu)
    if (!module.isEnabled()) return original(props)

    const value = original(Object.assign({}, props, { isFocused: true }))

    const i = value.props.children.length - 1
    value.props.children[i] = (
      <Layer layerContext={appLayerContext}>
        <AnimeTransition
          in={props.isFocused}
          animations={module.getAnimations(animationOptions)}
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
