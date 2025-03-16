import Modules from '@/modules/Modules'
import ModuleSettings from '@/modules/settingsRefresh/components/ModuleSettings'
import SettingsSidebarHeader from '@/modules/settingsRefresh/components/SettingsSidebarHeader'
import ModeSwitch from '@/modules/settingsRefresh/components/ModeSwitch'
import FormNotice from '@/modules/settingsRefresh/components/FormNotice'
import SettingsStore from '@/modules/settingsRefresh/stores/SettingsStore'
import SpineIcon from '@/modules/settingsRefresh/components/icons/SpineIcon'
import SettingsSections from '@/enums/SettingsSections'
import HomeIcon from '@/modules/settingsRefresh/components/icons/HomeIcon'
import ShopIcon from '@/modules/settingsRefresh/components/icons/ShopIcon'
import BookCheckIcon from '@/components/icons/BookCheckIcon'

export function getSections () {
  return [
    {
      section: 'CUSTOM',
      element: SettingsSidebarHeader
    },
    {
      section: SettingsSections.Home,
      label: 'Home',
      icon: <HomeIcon size="xs" color="currentColor" />,
      element: () => {}
    },
    {
      section: 'DIVIDER'
    },
    {
      section: SettingsSections.Catalog,
      label: 'Catalog',
      icon: <ShopIcon size="xs" color="currentColor" />,
      element: () => {}
    },
    {
      section: SettingsSections.Library,
      label: 'Library',
      icon: <BookCheckIcon size="xs" color="currentColor" />,
      element: () => {}
    },
    {
      section: 'DIVIDER'
    },
    {
      section: 'CUSTOM',
      element: ModeSwitch
    },
    ...Modules.getAllModules(true).map(module => ({
      section: module.id,
      label: module.name,
      className: module.parent ? 'BA__nestedTabBarItem' : undefined,
      icon: module.parent ? <SpineIcon /> : undefined,
      elementProps: { moduleId: module.id },
      element: ModuleSettings,
      notice: {
        element: FormNotice,
        stores: [SettingsStore]
      }
    }))
  ]
}
