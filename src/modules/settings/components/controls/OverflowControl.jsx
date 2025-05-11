import { Checkbox, handleClick, Text, Tooltip } from '@/modules/DiscordModules'
import IconButton from '@/modules/settings/components/IconButton'
import RedoIcon from '@/modules/settings/components/icons/RedoIcon'
import { css } from '@/modules/Style'
import Documentation from '@/modules/Documentation'
import CircleQuestionIcon from '@/modules/settings/components/icons/CircleQuestionIcon'

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
      <IconButton onClick={() => handleClick({ href: Documentation.getSettingUrl(Documentation.Setting.Overflow) })}>
        <CircleQuestionIcon size="xs" color="currentColor" />
      </IconButton>
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