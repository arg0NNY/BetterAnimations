import Modules from '@/modules/Modules'
import ModuleSettings from '@/modules/settings/components/ModuleSettings'
import SettingsSidebarHeader from '@/modules/settings/components/SettingsSidebarHeader'
import ModeSwitch from '@/modules/settings/components/ModeSwitch'
import FormNotice from '@/modules/settings/components/FormNotice'
import SettingsStore from '@/modules/settings/stores/SettingsStore'
import SpineIcon from '@/modules/settings/components/icons/SpineIcon'
import SettingsSection from '@/enums/SettingsSection'
import HomeIcon from '@/modules/settings/components/icons/HomeIcon'
import ShopIcon from '@/modules/settings/components/icons/ShopIcon'
import BookCheckIcon from '@/components/icons/BookCheckIcon'

export function getSections () {
  return [
    {
      section: 'CUSTOM',
      element: SettingsSidebarHeader
    },
    {
      section: SettingsSection.Home,
      label: 'Home',
      icon: <HomeIcon size="xs" color="currentColor" />,
      element: () => {}
    },
    {
      section: 'DIVIDER'
    },
    {
      section: SettingsSection.Catalog,
      label: 'Catalog',
      icon: <ShopIcon size="xs" color="currentColor" />,
      element: () => {}
    },
    {
      section: SettingsSection.Library,
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
