import ButtonGroup from '@/settings/components/ButtonGroup'
import { Checkbox, Tooltip } from '@discord/modules'
import { stop } from '@/settings/utils/eventModifiers'
import { useAdvancedMode } from '@/settings/hooks/useMode'
import ModuleContext from '@/settings/context/ModuleContext'
import ModuleType from '@enums/ModuleType'
import { css } from '@style'
import Messages from '@shared/messages'
import DoorEnterIcon from '@/settings/components/icons/DoorEnterIcon'
import DoorExitIcon from '@/settings/components/icons/DoorExitIcon'
import { useCallback, use, useMemo, useState } from 'react'

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
      <Checkbox
        className="BA__animationToggleCheckbox"
        type={Checkbox.Types.INVERTED}
        size={22}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  )

  return disabled
    ? <Tooltip text={Messages.SELECT_ANIMATION_TO_ENABLE}>{checkbox}</Tooltip>
    : checkbox({})
}

function AnimationToggleControl ({ enter, exit, setEnter, setExit }) {
  const module = use(ModuleContext)
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
