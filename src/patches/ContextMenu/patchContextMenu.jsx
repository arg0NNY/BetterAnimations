import Patcher from '@/modules/Patcher'
import { ContextMenuKeyed, TransitionGroup } from '@discord/modules'
import AnimeTransition from '@components/AnimeTransition'
import patchContextSubmenu from '@/patches/ContextMenu/patchContextSubmenu'
import ensureOnce from '@utils/ensureOnce'
import Position from '@enums/Position'
import useModule, { injectModule } from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import Modules from '@/modules/Modules'
import { autoPosition } from '@/hooks/useAutoPosition'
import useWindow, { MainWindowOnly } from '@/hooks/useWindow'
import mouse from '@shared/mouse'
import { ErrorBoundary } from '@error/boundary'
import { cloneElement } from 'react'

function patchContextMenu () {
  const once = ensureOnce()

  Patcher.after(ModuleKey.ContextMenu, ...ContextMenuKeyed, (self, args, value) => {
    once(() => {
      injectModule(value.type, ModuleKey.ContextMenu)
      Patcher.after(ModuleKey.ContextMenu, value.type.prototype, 'componentDidMount', self => {
        self.__anchor = mouse?.getAnchor()
      })
      Patcher.after(ModuleKey.ContextMenu, value.type.prototype, 'render', (self, args, value) => {
        const module = Modules.getModule(ModuleKey.ContextMenu)
        if (!module.isEnabled()) return

        return (
          <ErrorBoundary module={module} fallback={value}>
            <MainWindowOnly fallback={value}>
              {() => {
                const { config = {} } = self.props
                const { autoRef, setPosition } = autoPosition(
                  self,
                  config.position ?? Position.Right,
                  { align: config.align ?? Position.Top }
                )

                if (value)
                  Patcher.after(value, 'type', (self, [props], value) => {
                    value.props.onPositionChange = props.onPositionChange ?? (() => {})
                    props.setLayerRef?.(value.props.ref)
                  })

                return (
                  <AnimeTransition
                    in={self.props.in && !!value}
                    layerRef={() => self.__layerRef?.current}
                    module={module}
                    autoRef={autoRef}
                    anchor={self.__anchor}
                  >
                    {value && cloneElement(value, {
                      onPositionChange: setPosition,
                      setLayerRef: value => self.__layerRef = value
                    })}
                  </AnimeTransition>
                )
              }}
            </MainWindowOnly>
          </ErrorBoundary>
        )
      })
    })

    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.ContextMenu)
    if (!isMainWindow || !module.isEnabled()) return

    return (
      <ErrorBoundary module={module} fallback={value}>
        <TransitionGroup component={null}>
          {value.props.isOpen && value}
        </TransitionGroup>
      </ErrorBoundary>
    )
  })

  patchContextSubmenu()
}

export default patchContextMenu
