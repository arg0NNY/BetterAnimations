import { Common, Tooltip } from '@/modules/DiscordModules'

function OverflowControl ({ value, onChange, forced = false }) {
  const control = (
    <Common.Checkbox
      value={value}
      onChange={(_, value) => onChange(value)}
      type={Common.Checkbox.Types.INVERTED}
      disabled={forced}
    >
      <Common.Text variant="text-sm/normal">Enable overflow</Common.Text>
    </Common.Checkbox>
  )

  if (!forced) return control

  return (
    <Tooltip text="Value is forced by animation" align="left">
      {props => <div {...props}>{control}</div>}
    </Tooltip>
  )
}

export default OverflowControl
