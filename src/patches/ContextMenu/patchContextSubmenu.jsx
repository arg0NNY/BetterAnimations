import { Patcher } from '@/BdApi'
import { MenuSubmenuItem, MenuSubmenuListItem } from '@/modules/DiscordModules'
import CloneTransition from '@/components/CloneTransition'
import { tempAnimationData } from '@/patches/ContextMenu/patchContextMenu'
import { clearContainingStyles } from '@/helpers/style'

function patchContextSubmenu () {
  const callback = (self, [props], original) => {
    const value = original(Object.assign({}, props, { isFocused: true }))

    const i = value.props.children.length - 1
    value.props.children[i] = (
      <CloneTransition
        in={props.isFocused}
        clone={false}
        animation={tempAnimationData}
        onEntered={clearContainingStyles}
        onExited={clearContainingStyles}
      >
        {value.props.children[i]}
      </CloneTransition>
    )

    return value
  }

  Patcher.instead(MenuSubmenuItem, 'MenuSubmenuItem', callback)
  Patcher.instead(MenuSubmenuListItem, 'MenuSubmenuListItem', callback)
}

export default patchContextSubmenu
