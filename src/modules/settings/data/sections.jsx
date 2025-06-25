import Modules from '@/modules/Modules'
import ModuleSettings from '@/modules/settings/views/ModuleSettings'
import SettingsSidebarHeader from '@/modules/settings/components/SettingsSidebarHeader'
import ModeSwitch from '@/modules/settings/components/ModeSwitch'
import FormNotice from '@/modules/settings/components/FormNotice'
import SettingsStore from '@/modules/settings/stores/SettingsStore'
import SpineIcon from '@/modules/settings/components/icons/SpineIcon'
import SettingsSection from '@enums/SettingsSection'
import HomeIcon from '@/modules/settings/components/icons/HomeIcon'
import ShopIcon from '@/modules/settings/components/icons/ShopIcon'
import BookCheckIcon from '@/components/icons/BookCheckIcon'
import Home from '@/modules/settings/views/Home'
import Catalog from '@/modules/settings/views/Catalog'
import Library from '@/modules/settings/views/Library'
import { ErrorBoundary } from '@error/boundary'

export function getSections () {
  return [
    {
      section: 'CUSTOM',
      element: ErrorBoundary.wrap(SettingsSidebarHeader)
    },
    {
      section: SettingsSection.Home,
      label: 'Home',
      icon: <HomeIcon size="xs" color="currentColor" />,
      element: ErrorBoundary.wrap(Home)
    },
    {
      section: 'DIVIDER'
    },
    {
      section: SettingsSection.Catalog,
      label: 'Catalog',
      icon: <ShopIcon size="xs" color="currentColor" />,
      element: ErrorBoundary.wrap(Catalog)
    },
    {
      section: SettingsSection.Library,
      label: 'Library',
      icon: <BookCheckIcon size="xs" color="currentColor" />,
      element: ErrorBoundary.wrap(Library)
    },
    {
      section: 'DIVIDER'
    },
    {
      section: 'CUSTOM',
      element: ErrorBoundary.wrap(ModeSwitch)
    },
    ...Modules.getAllModules(true).map(module => ({
      section: module.id,
      label: module.name,
      className: module.parent ? 'BA__nestedTabBarItem' : undefined,
      icon: module.parent ? <SpineIcon /> : undefined,
      elementProps: { moduleId: module.id },
      element: ErrorBoundary.wrap(ModuleSettings),
      notice: {
        element: FormNotice,
        stores: [SettingsStore]
      }
    }))
  ]
}
