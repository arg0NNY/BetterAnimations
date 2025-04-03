import { Common, Tooltip } from '@/modules/DiscordModules'
import IconButton from '@/modules/settingsRefresh/components/IconButton'
import RedoIcon from '@/modules/settingsRefresh/components/icons/RedoIcon'
import { css } from '@/modules/Style'

function OverflowControl ({ value, onChange, forced = false, onReset }) {
  const control = props => (
    <div {...props}>
      <Common.Checkbox
        value={value}
        onChange={(_, value) => onChange(value)}
        type={Common.Checkbox.Types.INVERTED}
        disabled={forced}
      >
        <Common.Text variant="text-sm/normal">Enable overflow</Common.Text>
      </Common.Checkbox>
    </div>
  )

  return (
    <div className="BA__overflowControl">
      {forced ? (
        <Tooltip text="Forced by the animation" hideOnClick={false}>
          {control}
        </Tooltip>
      ) : control()}
      {!forced && onReset && (
        <IconButton
          tooltip="Reset"
          onClick={onReset}
        >
          <RedoIcon size="xs" color="currentColor" />
        </IconButton>
      )}
    </div>
  )
}

export default OverflowControl

css
`.BA__overflowControl {
    display: flex;
    justify-content: space-between;
    align-items: center;
}`
`OverflowControl`