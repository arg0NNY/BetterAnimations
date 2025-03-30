import { FormItem, FormTitle } from '@/modules/DiscordModules'
import { css } from '@/modules/Style'
import IconButton from '@/modules/settingsRefresh/components/IconButton'
import RedoIcon from '@/modules/settingsRefresh/components/icons/RedoIcon'

function SettingControl ({ label, afterLabel, onReset, children }) {
  return (
    <FormItem className="BA__settingControl">
      <FormTitle tag="h5" className="BA__settingControlHeader">
        <span>{label}</span>
        {afterLabel}
        {onReset && (
          <IconButton
            className="BA__settingControlReset"
            tooltip="Reset"
            onClick={onReset}
          >
            <RedoIcon size="xs" color="currentColor" />
          </IconButton>
        )}
      </FormTitle>
      {children}
    </FormItem>
  )
}

export default SettingControl

css
`.BA__settingControlHeader {
    display: flex;
    align-items: center;
    gap: 8px;
}
.BA__settingControlReset {
    margin-left: auto;
}`
`SettingControl`