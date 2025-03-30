import { Common } from '@/modules/DiscordModules'
import AnimationSetting from '@/enums/AnimationSetting'
import SettingControl from '@/modules/settingsRefresh/components/controls/SettingControl'

function VariantControl ({ animation, value, onChange, defaultValue, onReset }) {
  const options = animation.settings[AnimationSetting.Variant].map(o => ({ label: o.name, value: o.key }))

  return (
    <SettingControl label="Variant" onReset={onReset}>
      <Common.SingleSelect
        placeholder={defaultValue}
        options={options}
        value={value}
        onChange={onChange}
      />
    </SettingControl>
  )
}

export default VariantControl
