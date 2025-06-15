import Patcher from '@/modules/Patcher'
import { ModalBackdrop } from '@discord/modules'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import findInReactTree from '@/utils/findInReactTree'
import DiscordClasses from '@discord/classes'
import AnimeTransition from '@components/AnimeTransition'
import useWindow from '@/hooks/useWindow'

function patchModalBackdrop () {
  Patcher.instead(ModalBackdrop, 'render', (self, [props, ...args], original) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.ModalsBackdrop)
    if (!isMainWindow || !module.isEnabled()) return original(props, ...args)

    const value = original({ ...props, isVisible: true }, ...args)

    const children = findInReactTree(value, m => m?.[0]?.props?.className?.includes(DiscordClasses.ModalBackdrop.backdrop))
    if (!children) return original(props, ...args)

    const [backdrop] = children
    if (backdrop) {
      backdrop.type = 'div'
      delete backdrop.props.style
      backdrop.props.children = (
        <div className="BA__backdrop" />
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
