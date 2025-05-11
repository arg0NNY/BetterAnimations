import Patcher from '@/modules/Patcher'
import { ModalBackdrop } from '@/modules/DiscordModules'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import findInReactTree from '@/utils/findInReactTree'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import AnimeTransition from '@/components/AnimeTransition'

function patchModalBackdrop () {
  Patcher.instead(ModalBackdrop, 'render', (self, [props, ...args], original) => {
    const module = useModule(ModuleKey.ModalsBackdrop)
    if (!module.isEnabled()) return original(props, ...args)

    const value = original({ ...props, isVisible: true }, ...args)

    const children = findInReactTree(value, m => m?.[0]?.props?.className?.includes(DiscordClasses.ModalBackdrop.backdrop))
    if (!children) return original(props, ...args)

    const [backdrop] = children
    if (backdrop) {
      backdrop.type = 'div'
      delete backdrop.props.style
      backdrop.props.children = (
        <div className="BA__modalBackdrop" />
      )
    }

    children[0] = (
      <AnimeTransition
        appear={true}
        in={props.isVisible}
        module={module}
        injectContainerRef={true}
      >
        {backdrop}
      </AnimeTransition>
    )

    return value
  })
}

export default patchModalBackdrop
