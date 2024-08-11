import { React } from '@/BdApi'
import ButtonGroup from '@/modules/settingsRefresh/components/ButtonGroup'
import { Common } from '@/modules/DiscordModules'
import { stop } from '@/modules/settingsRefresh/helpers/stopPropagation'
import { useAdvancedMode } from '@/modules/settingsRefresh/hooks/useMode'
import ModuleContext from '@/modules/settingsRefresh/context/ModuleContext'
import ModuleType from '@/enums/ModuleType'
import { css } from '@/modules/Style'

function useToggleHint () {
  const [hintShown, setHintShown] = React.useState(false)
  const showHint = React.useCallback(() => setHintShown(true), [setHintShown])
  const hideHint = React.useCallback(() => setHintShown(false), [setHintShown])

  const hintProps = React.useCallback((optionDisabled, text = 'Select any animation below to enable') => {
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

function AnimationToggleCheckbox ({ value, onChange, disabled, tooltip, ...props }) {
  const checkbox = _props => (
    <div {..._props} {...props}>
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

  return tooltip
    ? <Common.Tooltip {...tooltip}>{checkbox}</Common.Tooltip>
    : checkbox({})
}

function AnimationToggleControl ({ enter, exit, setEnter, setExit }) {
  const module = React.useContext(ModuleContext)
  const isAdvanced = useAdvancedMode(enter !== exit)

  const { hintProps } = useToggleHint()

  const options = React.useMemo(() => [
    {
      value: 'enter',
      tooltip: 'Enter',
      selected: enter,
      disabled: !setEnter,
      onClick: stop(() => setEnter(!enter)),
      children: <Common.DoorEnterIcon size="xs" color="currentColor" />,
      ...hintProps(!setEnter)
    },
    {
      value: 'exit',
      tooltip: 'Exit',
      selected: exit,
      disabled: !setExit,
      onClick: stop(() => setExit(!exit)),
      children: <Common.DoorExitIcon size="xs" color="currentColor" />,
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
      onClick={stop()}
      {...hintProps(!setEnter || !setExit)}
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
