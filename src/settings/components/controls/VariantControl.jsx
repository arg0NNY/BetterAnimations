import { SingleSelect } from '@discord/modules'
import AnimationSetting from '@enums/AnimationSetting'
import SettingControl from '@/settings/components/controls/SettingControl'
import Documentation from '@shared/documentation'

function VariantControl ({ animation, value, onChange, defaultValue, onReset }) {
  const options = animation.settings[AnimationSetting.Variant].map(o => ({ label: o.name, value: o.key }))

  return (
    <SettingControl label="Variant" doc={Documentation.Setting.Variant} onReset={onReset}>
      <SingleSelect
        placeholder={defaultValue}
        options={options}
        value={value}
        onChange={onChange}
      />
    </SettingControl>
  )
}

export default VariantControl
