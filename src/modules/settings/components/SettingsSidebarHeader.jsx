import IconBrand from '@/components/icons/IconBrand'
import { css } from '@/modules/Style'
import { Text } from '@/modules/DiscordModules'
import { useSection } from '@/modules/settings/stores/SettingsStore'
import { Utils } from '@/BdApi'
import SettingsSection from '@/enums/SettingsSection'
import meta from '@/meta'

function SettingsSidebarHeader () {
  const [section] = useSection()

  return (
    <div className={Utils.className(
      'BA__settingsSidebarHeader',
      {
        'BA__settingsSidebarHeader--hidden': section === SettingsSection.Home
      }
    )}>
      <IconBrand />
      <Text variant="text-md/semibold">{meta.name.slice(1)}</Text>
    </div>
  )
}

export default SettingsSidebarHeader

css
`.BA__settingsSidebarHeader {
    position: relative;
    margin-top: -30px;
    padding-bottom: 10px;
    transition: .2s opacity, .2s transform;
    pointer-events: none;
}
    
.BA__settingsSidebarHeader > svg {
    display: block;
    width: 52px;
    height: 52px;
}

.BA__settingsSidebarHeader > div {
    position: absolute;
    top: 26px;
    left: 41px;
    color: var(--header-primary);
}

.BA__settingsSidebarHeader--hidden {
    opacity: 0;
    transform: translateY(2px);
}`
`SettingsSidebarHeader`
