import Modules from '@/modules/Modules'
import ModuleSettings from '@/modules/settingsRefresh/components/ModuleSettings'
import SettingsSidebarHeader from '@/modules/settingsRefresh/components/SettingsSidebarHeader'
import ModeSwitch from '@/modules/settingsRefresh/components/ModeSwitch'
import FormNotice from '@/modules/settingsRefresh/components/FormNotice'
import SettingsNoticeStore from '@/modules/settingsRefresh/stores/SettingsNoticeStore'
import IconSpine from '@/modules/settingsRefresh/components/icons/IconSpine'
import { Common } from '@/modules/DiscordModules'
import SettingsSections from '@/enums/SettingsSections'

export function getSections () {
  return [
    {
      section: 'CUSTOM',
      element: SettingsSidebarHeader
    },
    {
      section: SettingsSections.Home,
      label: 'Home',
      icon: <Common.HomeIcon size="xs" color="currentColor" />,
      element: () => {}
    },
    { section: 'DIVIDER' },
    {
      section: 'CUSTOM',
      element: ModeSwitch
    },
    ...Modules.getAllModules(true).map(module => ({
      section: module.id,
      label: module.name,
      className: module.parent ? 'BA__nestedTabBarItem' : undefined,
      icon: module.parent ? <IconSpine /> : undefined,
      elementProps: { moduleId: module.id },
      element: ModuleSettings,
      notice: {
        element: FormNotice,
        stores: [SettingsNoticeStore]
      }
    }))
  ]
}
