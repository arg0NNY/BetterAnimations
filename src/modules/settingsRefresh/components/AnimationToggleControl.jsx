import ButtonGroup from '@/modules/settingsRefresh/components/ButtonGroup'
import { Common } from '@/modules/DiscordModules'
import { stop } from '@/modules/settingsRefresh/utils/eventModifiers'
import { useAdvancedMode } from '@/modules/settingsRefresh/hooks/useMode'
import ModuleContext from '@/modules/settingsRefresh/context/ModuleContext'
import ModuleType from '@/enums/ModuleType'
import { css } from '@/modules/Style'
import Messages from '@/modules/Messages'
import DoorEnterIcon from '@/modules/settingsRefresh/components/icons/DoorEnterIcon'
import DoorExitIcon from '@/modules/settingsRefresh/components/icons/DoorExitIcon'
import { useCallback, useContext, useMemo, useState } from 'react'

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

function AnimationToggleCheckbox ({ value, onChange, disabled }) {
  const checkbox = props => (
    <div {...props} onClick={stop()}>
      <Common.Checkbox
        className="BA__animationToggleCheckbox"
        type={Common.Checkbox.Types.INVERTED}
        size={22}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  )

  return disabled
    ? <Common.Tooltip text={Messages.SELECT_ANIMATION_TO_ENABLE}>{checkbox}</Common.Tooltip>
    : checkbox({})
}

function AnimationToggleControl ({ enter, exit, setEnter, setExit }) {
  const module = useContext(ModuleContext)
  const isAdvanced = useAdvancedMode(enter !== exit)

  const { hintProps } = useToggleHint()

  const options = useMemo(() => [
    {
      value: 'enter',
      tooltip: 'Enter',
      selected: enter,
      disabled: !setEnter,
      onClick: stop(() => setEnter(!enter)),
      children: <DoorEnterIcon size="xs" color="currentColor" />,
      ...hintProps(!setEnter)
    },
    {
      value: 'exit',
      tooltip: 'Exit',
      selected: exit,
      disabled: !setExit,
      onClick: stop(() => setExit(!exit)),
      children: <DoorExitIcon size="xs" color="currentColor" />,
      ...hintProps(!setExit)
    }
  ], [enter, exit, setEnter, setExit, hintProps])

  if (module.meta?.type === ModuleType.Switch && !isAdvanced) return (
    <AnimationToggleCheckbox
      value={enter && exit}
      onChange={(_, value) => {
        setEnter(value)
        setExit(value)
      }}
      disabled={!setEnter || !setExit}
    />
  )

  return (
    <ButtonGroup options={options} multiple />
  )
}

export default AnimationToggleControl

css
`.BA__animationToggleCheckbox {
    flex-grow: 0;
}`
`AnimationToggleControl`
