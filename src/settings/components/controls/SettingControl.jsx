import { Text } from '@discord/modules'
import { css } from '@style'
import IconButton from '@/settings/components/IconButton'
import RedoIcon from '@/components/icons/RedoIcon'
import Documentation from '@shared/documentation'
import Hint from '@/settings/components/Hint'

function SettingControl ({ label, doc, onReset, children }) {
  return (
    <div className="BA__settingControl">
      <Text
        className="BA__settingControlHeader"
        variant="text-md/semibold"
        color="text-strong"
      >
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
      </Text>
      {children}
    </div>
  )
}

export default SettingControl

css
`.BA__settingControl {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.BA__settingControlHeader {
    display: flex;
    align-items: center;
    gap: 4px;
}
.BA__settingControlReset {
    margin-left: auto;
}`
`SettingControl`
