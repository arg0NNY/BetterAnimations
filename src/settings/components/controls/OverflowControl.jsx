import { Checkbox, Text, Tooltip } from '@discord/modules'
import IconButton from '@/settings/components/IconButton'
import RedoIcon from '@/components/icons/RedoIcon'
import { css } from '@style'
import Documentation from '@shared/documentation'
import Hint from '@/settings/components/Hint'

function OverflowControl ({ value, onChange, forced = false, onReset }) {
  const control = props => (
    <div {...props}>
      <Checkbox
        value={value}
        onChange={(_, value) => onChange(value)}
        type={Checkbox.Types.INVERTED}
        disabled={forced}
      >
        <Text variant="text-sm/normal">Enable overflow</Text>
      </Checkbox>
    </div>
  )

  return (
    <div className="BA__overflowControl">
      {forced ? (
        <Tooltip text="Forced by the animation" hideOnClick={false}>
          {control}
        </Tooltip>
      ) : control()}
      <Hint href={Documentation.getSettingUrl(Documentation.Setting.Overflow)} />
      {!forced && onReset && (
        <IconButton
          className="BA__overflowControlReset"
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
    align-items: center;
    gap: 4px;
}
.BA__overflowControlReset {
    margin-left: auto;
}`
`OverflowControl`