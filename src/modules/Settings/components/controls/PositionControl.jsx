import { React } from '@/BdApi'
import ModuleContext from '@/modules/Settings/context/ModuleContext'
import positions from '@/data/positions'
import Auto from '@/enums/Auto'
import AnimationSetting from '@/enums/AnimationSetting'
import { Common } from '@/modules/DiscordModules'

function PositionControl ({ animation, value, onChange, defaultValue }) {
  const module = React.useContext(ModuleContext)

  const options = positions.filter(
    p => p.value === Auto()
      ? module?.supportsAuto(animation, AnimationSetting.Position)
      : (animation.settings.position === true || animation.settings.position.includes(p.value))
  )

  return (
    <Common.FormItem>
      <Common.FormTitle tag="h5">Position</Common.FormTitle>
      <Common.SingleSelect
        placeholder={defaultValue}
        options={options}
        value={value}
        onChange={onChange}
      />
    </Common.FormItem>
  )
}

export default PositionControl
