import AnimationSetting from '@enums/AnimationSetting'
import SettingControl from '@/settings/components/controls/SettingControl'
import Documentation from '@shared/documentation'
import DurationSlider from '@/settings/components/DurationSlider'

function DurationControl ({ animation, value, onChange, label = 'Duration', onReset, ...props }) {
  const { to, from } = animation.settings[AnimationSetting.Duration]

  return (
    <SettingControl label={label} doc={Documentation.Setting.Duration} onReset={onReset}>
      <DurationSlider
        {...props}
        from={from}
        to={to}
        initialValue={value}
        onValueChange={onChange}
      />
    </SettingControl>
  )
}

export default DurationControl
