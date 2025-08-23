import { css } from '@style'
import { Clickable, CopiableField, Text } from '@discord/modules'
import meta from '@/meta'
import { useMemo } from 'react'
import SocialLinks from '@/components/SocialLinks'
import { bdVersion } from '@/BdApi'

function SystemInfo () {
  const data = useMemo(() => [
    `${meta.name} ${meta.version}` + (import.meta.env.MODE === 'development' ? ' (Dev Bundle)' : ''),
    `BetterDiscord ${bdVersion}`
  ], [])

  return (
    <CopiableField
      text="Click to copy"
      copyValue={data.join('\n')}
    >
      {props => (
        <Clickable
          {...props}
          tag="div"
          className="BA__settingsSidebarFooterSystemInfo"
        >
          {data.map((text, i) => (
            <Text
              key={i}
              variant="text-xs/normal"
              color="text-muted"
            >
              {text}
            </Text>
          ))}
        </Clickable>
      )}
    </CopiableField>
  )
}

function SettingsSidebarFooter () {
  return (
    <div className="BA__settingsSidebarFooter">
      <SocialLinks />
      <SystemInfo />
    </div>
  )
}

export default SettingsSidebarFooter

css
`.BA__settingsSidebarFooter {
    padding: 8px 10px;
}
.BA__settingsSidebarFooterSystemInfo {
    margin-top: 16px;
    cursor: pointer;
}`
`SidebarFooter`
