import { Patcher, React } from '@/BdApi'
import { ContextMenu, TransitionGroup } from '@/modules/DiscordModules'
import AnimeTransition from '@/components/AnimeTransition'
import patchContextSubmenu from '@/patches/ContextMenu/patchContextSubmenu'
import ensureOnce from '@/helpers/ensureOnce'
import Position from '@/enums/Position'
import useModule, { injectModule } from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import Modules from '@/modules/Modules'
import { autoPosition } from '@/hooks/useAutoPosition'

function patchContextMenu () {
  const once = ensureOnce()

  Patcher.after(...ContextMenu, (self, args, value) => {
    once(() => {
      injectModule(value.type, ModuleKey.ContextMenu)
      Patcher.after(value.type.prototype, 'render', (self, args, value) => {
        const module = Modules.getModule(ModuleKey.ContextMenu)
        if (!module.isEnabled()) return

        const { config = {} } = self.props
        const { autoRef, setPosition } = autoPosition(
          self,
          config.position ?? Position.Right,
          { align: config.align ?? Position.Top }
        )

        if (value) {
          value.props.onPositionChange = setPosition
          Patcher.after(value, 'type', (self, [props], value) => {
            value.props.onPositionChange = props.onPositionChange ?? (() => {})
          })
        }

        return (
          <AnimeTransition
            in={self.props.in && !!value}
            targetContainer={e => e}
            module={module}
            autoRef={autoRef}
          >
            {value}
          </AnimeTransition>
        )
      })
    })

    const module = useModule(ModuleKey.ContextMenu)
    if (!module.isEnabled()) return

    return (
      <TransitionGroup component={null}>
        {value.props.isOpen && value}
      </TransitionGroup>
    )
  })

  patchContextSubmenu()
}

export default patchContextMenu
