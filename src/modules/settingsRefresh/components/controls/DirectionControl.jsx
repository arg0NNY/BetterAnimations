import { React } from '@/BdApi'
import directions from '@/data/directions'
import Auto from '@/enums/Auto'
import AnimationSetting from '@/enums/AnimationSetting'
import directionAxes from '@/data/directionAxes'
import { getDirectionsByAxis } from '@/helpers/direction'
import { Common } from '@/modules/DiscordModules'
import Direction from '@/enums/Direction'
import DirectionAutoType from '@/enums/DirectionAutoType'
import directionAnchorOptions from '@/data/directionAnchorOptions'
import { DiscordClasses } from '@/modules/DiscordSelectors'

function DirectionAxisControl ({ animation, value, onChange }) {
  const axisOptions = directionAxes.filter(
    a => animation.settings.direction === true
      || getDirectionsByAxis(a.value).every(d => animation.settings.direction.includes(d))
  )

  return (
    <Common.RadioGroup
      className={DiscordClasses.Margins.marginTop8}
      options={axisOptions}
      value={value}
      onChange={option => onChange(option.value)}
    />
  )
}

function DirectionAnchorControl ({ value, onChange }) {
  return (
    <Common.RadioGroup
      className={DiscordClasses.Margins.marginTop8}
      options={directionAnchorOptions}
      value={value}
      onChange={option => onChange(option.value)}
    />
  )
}

function DirectionControl ({ module, animation, value, onChange, defaultValue, axis, onAxisChange, towards, onTowardsChange }) {
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
