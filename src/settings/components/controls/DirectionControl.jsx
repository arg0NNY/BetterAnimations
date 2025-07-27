import directions from '@data/directions'
import Auto from '@enums/Auto'
import AnimationSetting from '@enums/AnimationSetting'
import directionAxes from '@data/directionAxes'
import { getDirectionsByAxis } from '@utils/direction'
import { SingleSelect } from '@discord/modules'
import Direction from '@enums/Direction'
import DirectionAutoType from '@enums/DirectionAutoType'
import directionAnchorOptions from '@data/directionAnchorOptions'
import DiscordClasses from '@discord/classes'
import ButtonGroup from '@/settings/components/ButtonGroup'
import HorizontalIcon from '@/settings/components/icons/HorizontalIcon'
import VerticalIcon from '@/settings/components/icons/VerticalIcon'
import DepthIcon from '@/settings/components/icons/DepthIcon'
import RepeatIcon from '@/settings/components/icons/RepeatIcon'
import Axis from '@enums/Axis'
import { css } from '@style'
import ArrowLeftToLineIcon from '@/settings/components/icons/ArrowLeftToLineIcon'
import ArrowRightFromLineIcon from '@/settings/components/icons/ArrowRightFromLineIcon'
import SettingControl from '@/settings/components/controls/SettingControl'
import Documentation from '@shared/documentation'

function getAxisIcon (axis) {
  switch (axis) {
    case Axis.Y: return <VerticalIcon color="currentColor" />
    case Axis.X: return <HorizontalIcon color="currentColor" />
    case Axis.Z: return <DepthIcon color="currentColor" />
  }
}

function getAnchorIcon (isTowards) {
  return isTowards
    ? <ArrowLeftToLineIcon color="currentColor" />
    : <ArrowRightFromLineIcon color="currentColor" />
}

function DirectionAxisControl ({ animation, value, onChange, reverse, onReverseChange }) {
  const axisOptions = directionAxes.filter(
    a => animation.settings.direction === true
      || getDirectionsByAxis(a.value).every(d => animation.settings.direction.includes(d))
  )

  const options = axisOptions.map(option => ({
    value: option.value,
    children: (
      <>
        {getAxisIcon(option.value)}
        <span>{option.name}</span>
      </>
    )
  }))

  return (
    <div className="BA__directionAxisControl">
      <ButtonGroup
        className="BA__directionAxisControlSelect"
        size="lg"
        options={options}
        selected={value}
        onChange={onChange}
      />
      <ButtonGroup
        className="BA__directionAxisControlReverse"
        size="lg"
        multiple={true}
        options={[{
          children: <RepeatIcon color="currentColor" />,
          tooltip: 'Reverse',
          selected: reverse,
          onClick: () => onReverseChange(!reverse)
        }]}
      />
    </div>
  )
}

function DirectionAnchorControl ({ value, onChange }) {
  const options = directionAnchorOptions.map(option => ({
    value: option.value,
    children: (
      <>
        {getAnchorIcon(option.value)}
        <span>{option.name}</span>
      </>
    )
  }))

  return (
    <ButtonGroup
      className={DiscordClasses.Margins.marginTop8}
      size="lg"
      options={options}
      selected={value}
      onChange={onChange}
    />
  )
}

function DirectionControl ({ module, animation, value, onChange, defaultValue, axis, onAxisChange, reverse, onReverseChange, towards, onTowardsChange, onReset }) {
  const options = directions.filter(
    d => d.value === Auto()
      ? module?.supportsAuto(animation, AnimationSetting.Direction)
      : (animation.settings[AnimationSetting.Direction] === true || animation.settings[AnimationSetting.Direction].includes(d.value))
  )

  const additionalControl = value === Auto(Direction).Auto
    ? {
        [DirectionAutoType.Alternate]: (
          <DirectionAxisControl
            animation={animation}
            value={axis}
            onChange={onAxisChange}
            reverse={reverse}
            onReverseChange={onReverseChange}
          />
        ),
        [DirectionAutoType.Anchor]: (
          <DirectionAnchorControl
            value={towards}
            onChange={onTowardsChange}
          />
        )
      }[module?.getSupportsAuto(AnimationSetting.Direction).type]
    : null

  return (
    <SettingControl label="Direction" doc={Documentation.Setting.Direction} onReset={onReset}>
      <SingleSelect
        placeholder={defaultValue}
        options={options}
        value={value}
        onChange={onChange}
      />
      {additionalControl}
    </SettingControl>
  )
}

export default DirectionControl

css
`.BA__directionAxisControl {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
}
.BA__directionAxisControlSelect {
    flex-grow: 1;
}
.BA__directionAxisControlReverse {
    flex-shrink: 0;
}`
`DirectionControl`
