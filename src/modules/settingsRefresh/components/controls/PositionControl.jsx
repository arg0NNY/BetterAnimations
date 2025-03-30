import positions from '@/data/positions'
import Auto from '@/enums/Auto'
import AnimationSetting from '@/enums/AnimationSetting'
import { Common } from '@/modules/DiscordModules'
import SettingControl from '@/modules/settingsRefresh/components/controls/SettingControl'

function PositionControl ({ module, animation, value, onChange, defaultValue, onReset }) {
  const options = positions.filter(
    p => p.value === Auto()
      ? module?.supportsAuto(animation, AnimationSetting.Position)
      : (animation.settings[AnimationSetting.Position] === true || animation.settings[AnimationSetting.Position].includes(p.value))
  )

  return (
    <SettingControl label="Position" onReset={onReset}>
      <Common.SingleSelect
        placeholder={defaultValue}
        options={options}
        value={value}
        onChange={onChange}
      />
    </SettingControl>
  )
}

export default PositionControl
