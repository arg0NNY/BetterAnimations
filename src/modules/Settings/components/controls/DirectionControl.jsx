import { React } from '@/BdApi'
import ModuleContext from '@/modules/Settings/context/ModuleContext'
import directions from '@/data/directions'
import Auto from '@/enums/Auto'
import AnimationSetting from '@/enums/AnimationSetting'
import directionAxes from '@/data/directionAxes'
import { getDirectionsByAxis } from '@/helpers/direction'
import { Common } from '@/modules/DiscordModules'
import Direction from '@/enums/Direction'

function DirectionControl ({ animation, value, onChange, axis, onAxisChange, defaultValue }) {
  const module = React.useContext(ModuleContext)

  const options = directions.filter(
    d => d.value === Auto()
      ? module?.supportsAuto(animation, AnimationSetting.Direction)
      : (animation.settings.direction === true || animation.settings.direction.includes(d.value))
  )

  const axisOptions = directionAxes.filter(
    a => animation.settings.direction === true
      || getDirectionsByAxis(a.value).every(d => animation.settings.direction.includes(d))
  )

  return (
    <Common.FormItem>
      <Common.FormTitle tag="h5">Direction</Common.FormTitle>
      <Common.SingleSelect
        placeholder={defaultValue}
        options={options}
        value={value}
        onChange={onChange}
      />
      {value === Auto(Direction).Auto && (
        <div style={{ marginTop: 10 }}>
          <Common.RadioGroup
            options={axisOptions}
            value={axis}
            onChange={option => onAxisChange(option.value)}
          />
        </div>
      )}
    </Common.FormItem>
  )
}

export default DirectionControl
