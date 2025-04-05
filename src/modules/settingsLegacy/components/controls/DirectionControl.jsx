import { React } from '@/BdApi'
import ModuleContext from '@/modules/settingsLegacy/context/ModuleContext'
import directions from '@/data/directions'
import Auto from '@/enums/Auto'
import AnimationSetting from '@/enums/AnimationSetting'
import directionAxes from '@/data/directionAxes'
import { getDirectionsByAxis } from '@/helpers/direction'
import { Common } from '@/modules/DiscordModules'
import Direction from '@/enums/Direction'
import DirectionAutoType from '@/enums/DirectionAutoType'
import directionAnchorOptions from '@/data/directionAnchorOptions'

function DirectionAxisControl ({ animation, value, onChange }) {
  const axisOptions = directionAxes.filter(
    a => animation.settings.direction === true
      || getDirectionsByAxis(a.value).every(d => animation.settings.direction.includes(d))
  )

  return (
    <div style={{ marginTop: 10 }}>
      <Common.RadioGroup
        options={axisOptions}
        value={value}
        onChange={option => onChange(option.value)}
      />
    </div>
  )
}

function DirectionAnchorControl ({ value, onChange }) {
  return (
    <div style={{ marginTop: 10 }}>
      <Common.RadioGroup
        options={directionAnchorOptions}
        value={value}
        onChange={option => onChange(option.value)}
      />
    </div>
  )
}

function DirectionControl ({ animation, value, onChange, defaultValue, axis, onAxisChange, towards, onTowardsChange }) {
  const module = React.useContext(ModuleContext)

  const options = directions.filter(
    d => d.value === Auto()
      ? module?.supportsAuto(animation, AnimationSetting.Direction)
      : (animation.settings.direction === true || animation.settings.direction.includes(d.value))
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
