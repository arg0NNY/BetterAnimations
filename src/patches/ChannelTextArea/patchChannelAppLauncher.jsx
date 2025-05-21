import Patcher from '@/modules/Patcher'
import { AppLauncherPopup, ChannelAppLauncher, TransitionGroup } from '@/modules/DiscordModules'
import findInReactTree from '@/utils/findInReactTree'
import { useRef } from 'react'
import useWindow from '@/hooks/useWindow'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import useAutoPosition from '@/hooks/useAutoPosition'
import Position from '@enums/Position'
import AnimeTransition from '@components/AnimeTransition'

function patchAppLauncherPopup () {
  Patcher.after(AppLauncherPopup, 'type', (self, [props], value) => {
    const positionLayer = findInReactTree(value, m => m?.className?.includes('positionLayer'))
    if (!positionLayer) return

    positionLayer.ref = props.layerRef
    positionLayer.onPositionChange = props.onPositionChange
  })
}

function patchChannelAppLauncher () {
  Patcher.after(ChannelAppLauncher, 'type', (self, args, value) => {
    const layerRef = useRef()
    const { autoRef, setPosition } = useAutoPosition(Position.Top, { align: Position.Right })

    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Popouts)
    if (!isMainWindow || !module.isEnabled()) return

    const wrapper = findInReactTree(value, m => Array.isArray(m?.children))
    if (!wrapper) return

    const { children } = wrapper
    const popupIndex = children.length - 1 // Can't query because it will be unmounted if closed

    if (children[popupIndex])
      Object.assign(children[popupIndex].props, {
        layerRef,
        onPositionChange: setPosition
      })

    children[popupIndex] = (
      <TransitionGroup component={null}>
        {children[popupIndex] && (
          <AnimeTransition
            module={module}
            layerRef={layerRef}
            autoRef={autoRef}
            anchor={children[popupIndex].props?.positionTargetRef}
          >
            {children[popupIndex]}
          </AnimeTransition>
        )}
      </TransitionGroup>
    )
  })

  patchAppLauncherPopup()
}

export default patchChannelAppLauncher
