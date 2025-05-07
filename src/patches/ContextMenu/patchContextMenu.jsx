import { Patcher } from '@/BdApi'
import { ContextMenuKeyed, TransitionGroup } from '@/modules/DiscordModules'
import AnimeTransition from '@/components/AnimeTransition'
import patchContextSubmenu from '@/patches/ContextMenu/patchContextSubmenu'
import ensureOnce from '@/utils/ensureOnce'
import Position from '@/enums/Position'
import useModule, { injectModule } from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import Modules from '@/modules/Modules'
import { autoPosition } from '@/hooks/useAutoPosition'
import Mouse from '@/modules/Mouse'

function patchContextMenu () {
  const once = ensureOnce()

  Patcher.after(...ContextMenuKeyed, (self, args, value) => {
    once(() => {
      injectModule(value.type, ModuleKey.ContextMenu)
      Patcher.after(value.type.prototype, 'componentDidMount', self => {
        self.__anchor = Mouse.getAnchor()
      })
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
          value.props.setLayerRef = value => self.__layerRef = value
          Patcher.after(value, 'type', (self, [props], value) => {
            value.props.onPositionChange = props.onPositionChange ?? (() => {})
            props.setLayerRef?.(value.props.ref)
          })
        }

        return (
          <AnimeTransition
            in={self.props.in && !!value}
            layerRef={() => self.__layerRef?.current}
            module={module}
            autoRef={autoRef}
            anchor={self.__anchor}
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
