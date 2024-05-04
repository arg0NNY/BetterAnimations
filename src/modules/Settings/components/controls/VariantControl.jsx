import { Common } from '@/modules/DiscordModules'
import { React } from '@/BdApi'

function VariantControl ({ options, value, onChange, defaultValue }) {
  options = options.map(o => ({ label: o.name, value: o.key }))

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
