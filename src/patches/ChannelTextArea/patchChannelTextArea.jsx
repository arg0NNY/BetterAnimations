import patchExpressionPicker from '@/patches/ChannelTextArea/patchExpressionPicker'
import Patcher from '@/modules/Patcher'
import {
  ChannelTextArea,
  ChannelTextAreaButtons,
  TransitionGroup,
  useExpressionPickerStoreKeyed
} from '@discord/modules'
import findInReactTree from '@/utils/findInReactTree'
import useWindow from '@/hooks/useWindow'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import AnimeTransition from '@components/AnimeTransition'
import useAutoPosition from '@/hooks/useAutoPosition'
import Position from '@enums/Position'
import { useCallback, useRef } from 'react'
import { unkeyed } from '@/utils/webpack'
import patchChannelAppLauncher from '@/patches/ChannelTextArea/patchChannelAppLauncher'

function patchChannelTextAreaButtons () {
  Patcher.after(ChannelTextAreaButtons, 'type', (self, [{ buttonRefs }], value) => {
    if (!buttonRefs) return

    const buttons = findInReactTree(value, m => m?.className?.includes('buttons'))
    if (!buttons) return

    for (const button of buttons.children) {
      if (!button.key) continue
      button.props.ref = el => buttonRefs.current[button.key] = el
    }
  })
}

function patchChannelTextArea () {
  Patcher.after(ChannelTextArea.type, 'render', (self, args, value) => {
    const { autoRef, setPosition } = useAutoPosition(Position.Top, { align: Position.Right })

    const buttonRefs = useRef({})
    const anchorRef = useCallback(() => {
      const { activeView, lastActiveView } = unkeyed(useExpressionPickerStoreKeyed).getState()
      return buttonRefs.current[activeView ?? lastActiveView]
        ?? buttonRefs.current['emoji']
    }, [buttonRefs])

    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Popouts)
    if (!isMainWindow || !module.isEnabled()) return

    const buttons = findInReactTree(value, m => m?.type === ChannelTextAreaButtons)
    if (buttons) buttons.props.buttonRefs = buttonRefs

    const wrapper = findInReactTree(value, m => Array.isArray(m?.children))
    if (!wrapper) return

    const { children } = wrapper
    const expressionPickerIndex = children.length - 1 // Can't query because it will be unmounted if closed
    const injectContainerRef = (children, ref) => {
      if (children?.props) children.props.__containerRef = ref
    }

    if (children[expressionPickerIndex])
      children[expressionPickerIndex].props.onPositionChange = setPosition

    children[expressionPickerIndex] = (
      <TransitionGroup component={null}>
        {children[expressionPickerIndex] && (
          <AnimeTransition
            module={module}
            injectContainerRef={injectContainerRef}
            autoRef={autoRef}
            anchor={anchorRef}
          >
            {children[expressionPickerIndex]}
          </AnimeTransition>
        )}
      </TransitionGroup>
    )
  })

  patchChannelTextAreaButtons()
  patchExpressionPicker()
  patchChannelAppLauncher()
}

export default patchChannelTextArea
