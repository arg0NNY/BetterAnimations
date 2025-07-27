import ButtonGroup from '@/settings/components/ButtonGroup'
import { stop } from '@/settings/utils/eventModifiers'
import { useAdvancedMode } from '@/settings/hooks/useMode'
import ModuleContext from '@/settings/context/ModuleContext'
import ModuleType from '@enums/ModuleType'
import { css } from '@style'
import Messages from '@shared/messages'
import DoorEnterIcon from '@/settings/components/icons/DoorEnterIcon'
import DoorExitIcon from '@/settings/components/icons/DoorExitIcon'
import { useCallback, use, useMemo, useState } from 'react'
import CheckIcon from '@/settings/components/icons/CheckIcon'

function useToggleHint () {
  const [hintShown, setHintShown] = useState(false)
  const showHint = useCallback(() => setHintShown(true), [setHintShown])
  const hideHint = useCallback(() => setHintShown(false), [setHintShown])

  const hintProps = useCallback((optionDisabled, text = Messages.SELECT_ANIMATION_TO_ENABLE) => {
    if (!optionDisabled) return {}
    return Object.assign(
      { onClick: stop(showHint) },
      hintShown ? {
        tooltip: { text, onTooltipHide: hideHint }
      } : {}
    )
  }, [hintShown, showHint, hideHint])

  return {
    hintShown,
    setHintShown,
    showHint,
    hideHint,
    hintProps
  }
}

function AnimationToggleControl ({ enter, exit, setEnter, setExit }) {
  const module = use(ModuleContext)
  const isAdvanced = useAdvancedMode(enter !== exit)

  const { hintProps } = useToggleHint()

  const options = useMemo(() => {
    if (module.meta?.type === ModuleType.Switch && !isAdvanced) return [
      {
        value: 'enabled',
        selected: enter && exit,
        disabled: !setEnter || !setExit,
        onClick: stop(() => {
          const value = !(enter && exit)
          setEnter(value)
          setExit(value)
        }),
        children: (
          <CheckIcon
            size="sm"
            color="currentColor"
          />
        ),
        ...hintProps(!setEnter || !setExit)
      }
    ]

    return [
      {
        value: 'enter',
        tooltip: 'Enter',
        selected: enter,
        disabled: !setEnter,
        onClick: stop(() => setEnter(!enter)),
        children: (
          <DoorEnterIcon
            size="custom"
            width={18}
            height={18}
            color="currentColor"
          />
        ),
        ...hintProps(!setEnter)
      },
      {
        value: 'exit',
        tooltip: 'Exit',
        selected: exit,
        disabled: !setExit,
        onClick: stop(() => setExit(!exit)),
        children: (
          <DoorExitIcon
            size="custom"
            width={18}
            height={18}
            color="currentColor"
          />
        ),
        ...hintProps(!setExit)
      }
    ]
  }, [enter, exit, setEnter, setExit, hintProps, module.meta?.type, isAdvanced])

  return (
    <ButtonGroup
      size="md"
      itemClassName="BA__animationToggleGroupItem"
      options={options}
      multiple
    />
  )
}

export default AnimationToggleControl

css
`.BA__animationToggleGroupItem {
    border: none;
    background-color: transparent;
    border-radius: 0 !important;
}
.BA__animationToggleGroupItem:last-of-type {
    border-bottom-right-radius: 8px !important;
}`
`AnimationToggleControl`
