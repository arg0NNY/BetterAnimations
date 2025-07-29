import { FormItem, FormTitle } from '@discord/modules'
import { css } from '@style'
import IconButton from '@/settings/components/IconButton'
import RedoIcon from '@/components/icons/RedoIcon'
import Documentation from '@shared/documentation'
import Hint from '@/settings/components/Hint'

function SettingControl ({ label, doc, onReset, children }) {
  return (
    <FormItem className="BA__settingControl">
      <FormTitle tag="h5" className="BA__settingControlHeader">
        <span>{label}</span>
        {doc && (
          <Hint href={Documentation.getSettingUrl(doc)} />
        )}
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
    gap: 4px;
}
.BA__settingControlReset {
    margin-left: auto;
}`
`SettingControl`