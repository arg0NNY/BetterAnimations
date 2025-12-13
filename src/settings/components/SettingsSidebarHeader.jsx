import IconBrand from '@/components/icons/IconBrand'
import { css } from '@style'
import { Text } from '@discord/modules'
import { useSection } from '@/settings/stores/SettingsStore'
import SettingsSection from '@enums/SettingsSection'
import meta from '@/meta'
import classNames from 'classnames'

function SettingsSidebarHeader () {
  const [section] = useSection()

  return (
    <div className={classNames(
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
    color: var(--text-strong);
}

.BA__settingsSidebarHeader--hidden {
    opacity: 0;
    transform: translateX(-2px);
}`
`SettingsSidebarHeader`
