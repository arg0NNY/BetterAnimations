import easings from '@/data/easings'
import { Common } from '@/modules/DiscordModules'
import { React } from '@/BdApi'

function EasingControl ({ value, onChange, defaultValue }) {
  const options = easings.map(e => ({ label: e, value: e }))

  return (
    <Common.FormItem>
      <Common.FormTitle tag="h5">Easing</Common.FormTitle>
      <Common.SingleSelect
        placeholder={defaultValue}
        options={options}
        value={value}
        onChange={onChange}
      />
    </Common.FormItem>
  )
}

export default EasingControl
