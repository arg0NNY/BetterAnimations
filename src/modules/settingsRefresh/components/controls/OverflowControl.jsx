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

  const text = () => <>Force {value ? 'enabled' : 'disabled'} by&nbsp;the&nbsp;animation</>

  return (
    <div className="BA__overflowControl">
      {forced ? (
        <Tooltip text={text} hideOnClick={false}>
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