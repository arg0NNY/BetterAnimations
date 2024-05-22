import { Patcher } from '@/BdApi'
import { appLayerContext, Layer, MenuSubmenuItem, MenuSubmenuListItem } from '@/modules/DiscordModules'
import AnimeTransition from '@/components/AnimeTransition'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import { auto } from '@/patches/ContextMenu/patchContextMenu'

function patchContextSubmenu () {
  const callback = (self, [props], original) => {
    const module = useModule(ModuleKey.ContextMenu)
    if (!module.isEnabled()) return original(props)

    const value = original(Object.assign({}, props, { isFocused: true }))

    const i = value.props.children.length - 1
    value.props.children[i] = (
      <AnimeTransition
        in={props.isFocused}
        targetContainer={e => e}
        module={module}
        auto={auto}
      >
        <Layer layerContext={appLayerContext}>
          {value.props.children[i]}
        </Layer>
      </AnimeTransition>
    )

    return value
  }

  Patcher.instead(MenuSubmenuItem, 'MenuSubmenuItem', callback)
  Patcher.instead(MenuSubmenuListItem, 'MenuSubmenuListItem', callback)
}

export default patchContextSubmenu
