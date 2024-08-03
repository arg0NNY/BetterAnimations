import { Common } from '@/modules/DiscordModules'
import { React } from '@/BdApi'
import AnimationSetting from '@/enums/AnimationSetting'

function VariantControl ({ animation, value, onChange, defaultValue }) {
  const options = animation.settings[AnimationSetting.Variant].map(o => ({ label: o.name, value: o.key }))

  return (
    <Common.FormItem>
      <Common.FormTitle tag="h5">Variant</Common.FormTitle>
      <Common.SingleSelect
        placeholder={defaultValue}
        options={options}
        value={value}
        onChange={onChange}
      />
    </Common.FormItem>
  )
}

export default VariantControl
