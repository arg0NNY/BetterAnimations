import { Patcher } from '@/BdApi'
import { ModalBackdrop } from '@/modules/DiscordModules'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import findInReactTree from '@/helpers/findInReactTree'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import AnimeTransition from '@/components/AnimeTransition'
import Modules from '@/modules/Modules'

function patchModalBackdrop () {
  Patcher.before(ModalBackdrop, 'render', (self, [props]) => {
    const module = useModule(ModuleKey.ModalsBackdrop)
    if (!module.isEnabled()) return

    props._isVisible = props.isVisible
    props.isVisible = true
  })
  Patcher.after(ModalBackdrop, 'render', (self, [props], value) => {
    const module = Modules.getModule(ModuleKey.ModalsBackdrop)
    if (!module.isEnabled()) return

    const children = findInReactTree(value, m => m?.[0]?.props?.className?.includes(DiscordClasses.ModalBackdrop.backdrop))
    if (!children) return

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
        in={props._isVisible}
        module={module}
        targetContainer={e => e}
      >
        {backdrop}
      </AnimeTransition>
    )
  })
}

export default patchModalBackdrop
