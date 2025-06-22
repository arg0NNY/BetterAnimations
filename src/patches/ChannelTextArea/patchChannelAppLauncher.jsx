import Patcher from '@/modules/Patcher'
import { AppLauncherPopup, ChannelAppLauncher, TransitionGroup } from '@discord/modules'
import findInReactTree, { byClassName } from '@/utils/findInReactTree'
import { cloneElement, useRef } from 'react'
import useWindow from '@/hooks/useWindow'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import useAutoPosition from '@/hooks/useAutoPosition'
import Position from '@enums/Position'
import AnimeTransition from '@components/AnimeTransition'
import { ErrorBoundary } from '@error/boundary'

function patchAppLauncherPopup () {
  Patcher.after(ModuleKey.Popouts, AppLauncherPopup, 'type', (self, [props], value) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Popouts)
    if (!isMainWindow || !module.isEnabled()) return

    const positionLayer = findInReactTree(value, byClassName('positionLayer'))
    if (!positionLayer) return

    positionLayer.props.ref = props.layerRef
    positionLayer.props.onPositionChange = props.onPositionChange
  })
}

function patchChannelAppLauncher () {
  Patcher.after(ModuleKey.Popouts, ChannelAppLauncher, 'type', (self, args, value) => {
    const layerRef = useRef()
    const { autoRef, setPosition } = useAutoPosition(Position.Top, { align: Position.Right })

    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Popouts)
    if (!isMainWindow || !module.isEnabled()) return

    const wrapper = findInReactTree(value, m => Array.isArray(m?.children))
    if (!wrapper) return

    const { children } = wrapper
    const popupIndex = children.length - 1 // Can't query because it will be unmounted if closed

    children[popupIndex] = (
      <ErrorBoundary module={module} fallback={children[popupIndex]}>
        <TransitionGroup component={null}>
          {children[popupIndex] && (
            <AnimeTransition
              module={module}
              layerRef={layerRef}
              autoRef={autoRef}
              anchor={children[popupIndex].props?.positionTargetRef}
            >
              {cloneElement(children[popupIndex], {
                layerRef,
                onPositionChange: setPosition
              })}
            </AnimeTransition>
          )}
        </TransitionGroup>
      </ErrorBoundary>
    )
  })

  patchAppLauncherPopup()
}

export default patchChannelAppLauncher
