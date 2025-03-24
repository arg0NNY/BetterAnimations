import { React } from '@/BdApi'
import directions from '@/data/directions'
import Auto from '@/enums/Auto'
import AnimationSetting from '@/enums/AnimationSetting'
import directionAxes from '@/data/directionAxes'
import { getDirectionsByAxis } from '@/utils/direction'
import { Common } from '@/modules/DiscordModules'
import Direction from '@/enums/Direction'
import DirectionAutoType from '@/enums/DirectionAutoType'
import directionAnchorOptions from '@/data/directionAnchorOptions'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import ButtonGroup from '@/modules/settingsRefresh/components/ButtonGroup'
import HorizontalIcon from '@/modules/settingsRefresh/components/icons/HorizontalIcon'
import VerticalIcon from '@/modules/settingsRefresh/components/icons/VerticalIcon'
import DepthIcon from '@/modules/settingsRefresh/components/icons/DepthIcon'
import RepeatIcon from '@/modules/settingsRefresh/components/icons/RepeatIcon'
import Axis from '@/enums/Axis'
import { css } from '@/modules/Style'
import ArrowLeftToLineIcon from '@/modules/settingsRefresh/components/icons/ArrowLeftToLineIcon'
import ArrowRightFromLineIcon from '@/modules/settingsRefresh/components/icons/ArrowRightFromLineIcon'

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
        size={ButtonGroup.Sizes.MEDIUM}
        options={options}
        selected={value}
        onChange={onChange}
      />
      <ButtonGroup
        className="BA__directionAxisControlReverse"
        size={ButtonGroup.Sizes.MEDIUM}
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
      size={ButtonGroup.Sizes.MEDIUM}
      options={options}
      selected={value}
      onChange={onChange}
    />
  )
}

function DirectionControl ({ module, animation, value, onChange, defaultValue, axis, onAxisChange, reverse, onReverseChange, towards, onTowardsChange }) {
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
      }[module?.meta.settings?.supportsAuto?.[AnimationSetting.Direction]]
    : null

  return (
    <Common.FormItem>
      <Common.FormTitle tag="h5">Direction</Common.FormTitle>
      <Common.SingleSelect
        placeholder={defaultValue}
        options={options}
        value={value}
        onChange={onChange}
      />
      {additionalControl}
    </Common.FormItem>
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
