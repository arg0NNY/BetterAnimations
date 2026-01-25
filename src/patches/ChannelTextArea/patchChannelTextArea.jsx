import patchExpressionPicker from '@/patches/ChannelTextArea/patchExpressionPicker'
import Patcher, { TinyPatcher } from '@/modules/Patcher'
import {
  ChannelTextArea,
  ChannelTextAreaButtons,
  TransitionGroup,
  useExpressionPickerStoreKeyed
} from '@discord/modules'
import findInReactTree, { byClassName } from '@/utils/findInReactTree'
import useWindow from '@/hooks/useWindow'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import AnimeTransition from '@components/AnimeTransition'
import useAutoPosition from '@/hooks/useAutoPosition'
import Position from '@enums/Position'
import { cloneElement, useCallback, useRef } from 'react'
import { unkeyed } from '@/utils/webpack'
import { ErrorBoundary } from '@error/boundary'

function patchChannelTextAreaButtons () {
  Patcher.after(ModuleKey.Popouts, ChannelTextAreaButtons, 'type', (self, [{ buttonRefs }], value) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Popouts)
    if (!isMainWindow || !module.isEnabled() || !buttonRefs) return

    const buttons = findInReactTree(value, byClassName('buttons'))
    if (!buttons) return

    for (const button of buttons.props.children) {
      if (!button.key) continue
      button.props.ref = el => buttonRefs.current[button.key] = el
    }
  })
}

function useButtonRefs (value) {
  const buttonRefs = useRef({})

  const { isMainWindow } = useWindow()
  const module = useModule(ModuleKey.Popouts)
  if (!isMainWindow || !module.isEnabled()) return buttonRefs

  const buttons = findInReactTree(value, m => m?.type === ChannelTextAreaButtons)
  if (buttons) buttons.props.buttonRefs = buttonRefs

  return buttonRefs
}

function useExpressionPicker (value, buttonRefs) {
  const { autoRef, setPosition } = useAutoPosition(Position.Top, { align: Position.Right })
  const anchorRef = useCallback(() => {
    const { activeView, lastActiveView } = unkeyed(useExpressionPickerStoreKeyed).getState()
    return buttonRefs.current[activeView ?? lastActiveView]
      ?? buttonRefs.current['emoji']
  }, [buttonRefs])

  const { isMainWindow } = useWindow()
  const module = useModule(ModuleKey.Popouts)
  if (!isMainWindow || !module.isEnabled()) return

  const wrapper = findInReactTree(value, m => Array.isArray(m?.children))
  if (!wrapper) return

  const { children } = wrapper
  const expressionPickerIndex = children.length - 1 // Can't query because it will be unmounted if closed
  const injectContainerRef = (children, ref) => {
    if (children?.props) children.props.__containerRef = ref
  }

  children[expressionPickerIndex] = (
    <ErrorBoundary module={module} fallback={children[expressionPickerIndex]}>
      <TransitionGroup component={null}>
        {children[expressionPickerIndex] && (
          <AnimeTransition
            module={module}
            injectContainerRef={injectContainerRef}
            autoRef={autoRef}
            anchor={anchorRef}
          >
            {cloneElement(children[expressionPickerIndex], {
              onPositionChange: setPosition
            })}
          </AnimeTransition>
        )}
      </TransitionGroup>
    </ErrorBoundary>
  )
}

function useAppLauncherPopup (value, buttonRefs) {
  const layerRef = useRef()
  const { autoRef, setPosition } = useAutoPosition(Position.Top, { align: Position.Right })

  const { isMainWindow } = useWindow()
  const module = useModule(ModuleKey.Popouts)
  if (!isMainWindow || !module.isEnabled()) return

  const inner = findInReactTree(value, byClassName('inner'))
  if (!inner) return

  const { children } = inner.props
  const popupIndex = 0 // Can't query because it will be unmounted if closed

  if (children[popupIndex]) {
    TinyPatcher.after(ModuleKey.Popouts, children[popupIndex].type, 'type', (self, [props], value) => {
      const positionLayer = findInReactTree(value, byClassName('positionLayer'))
      if (!positionLayer) return
      positionLayer.props.ref = props.layerRef
      positionLayer.props.onPositionChange = props.onPositionChange
    })
  }

  children[popupIndex] = (
    <ErrorBoundary module={module} fallback={children[popupIndex]}>
      <TransitionGroup component={null}>
        {children[popupIndex] && (
          <AnimeTransition
            module={module}
            layerRef={layerRef}
            autoRef={autoRef}
            anchor={() => buttonRefs.current['appLauncher'] ?? children[popupIndex].props?.positionTargetRef}
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
}

function patchChannelTextArea () {
  Patcher.after(ModuleKey.Popouts, ChannelTextArea?.type, 'render', (self, args, value) => {
    const buttonRefs = useButtonRefs(value)
    useExpressionPicker(value, buttonRefs)
    useAppLauncherPopup(value, buttonRefs)
  })

  patchChannelTextAreaButtons()
  patchExpressionPicker()
}

export default patchChannelTextArea
