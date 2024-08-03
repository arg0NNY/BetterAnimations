import { React } from '@/BdApi'
import positions from '@/data/positions'
import Auto from '@/enums/Auto'
import AnimationSetting from '@/enums/AnimationSetting'
import { Common } from '@/modules/DiscordModules'

function PositionControl ({ module, animation, value, onChange, defaultValue }) {
  const options = positions.filter(
    p => p.value === Auto()
      ? module?.supportsAuto(animation, AnimationSetting.Position)
      : (animation.settings[AnimationSetting.Position] === true || animation.settings[AnimationSetting.Position].includes(p.value))
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
