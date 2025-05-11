import { FormItem, FormTitle, handleClick } from '@/modules/DiscordModules'
import { css } from '@/modules/Style'
import IconButton from '@/modules/settings/components/IconButton'
import RedoIcon from '@/modules/settings/components/icons/RedoIcon'
import Documentation from '@/modules/Documentation'
import CircleQuestionIcon from '@/modules/settings/components/icons/CircleQuestionIcon'

function SettingControl ({ label, doc, onReset, children }) {
  return (
    <FormItem className="BA__settingControl">
      <FormTitle tag="h5" className="BA__settingControlHeader">
        <span>{label}</span>
        {doc && (
          <IconButton onClick={() => handleClick({ href: Documentation.getSettingUrl(doc) })}>
            <CircleQuestionIcon size="xs" color="currentColor" />
          </IconButton>
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