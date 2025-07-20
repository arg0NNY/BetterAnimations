import Core from '@/modules/Core'
import ModuleSettings from '@/settings/views/ModuleSettings'
import SettingsSidebarHeader from '@/settings/components/SettingsSidebarHeader'
import ModeSwitch from '@/settings/components/ModeSwitch'
import FormNotice from '@/settings/components/FormNotice'
import SettingsStore from '@/settings/stores/SettingsStore'
import SpineIcon from '@/settings/components/icons/SpineIcon'
import SettingsSection from '@enums/SettingsSection'
import HomeIcon from '@/settings/components/icons/HomeIcon'
import ShopIcon from '@/settings/components/icons/ShopIcon'
import BookCheckIcon from '@/components/icons/BookCheckIcon'
import Home from '@/settings/views/Home'
import Catalog from '@/settings/views/Catalog'
import Library from '@/settings/views/Library'
import { ErrorBoundary } from '@error/boundary'
import GeneralSettings from '@/settings/views/GeneralSettings'
import SettingsIcon from '@/settings/components/icons/SettingsIcon'
import usePackRegistry from '@/hooks/usePackRegistry'
import { useMemo } from 'react'
import CircleWarningIcon from '@/settings/components/icons/CircleWarningIcon'
import { colors } from '@discord/modules'

export function useSections () {
  const registry = usePackRegistry()
  const hasIssues = registry.verifier.hasIssues()

  return useMemo(() => {
    const notice = {
      element: FormNotice,
      stores: [SettingsStore]
    }

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
        icon: hasIssues
          ? <CircleWarningIcon size="xs" color={colors.STATUS_DANGER} />
          : <BookCheckIcon size="xs" color="currentColor" />,
        element: ErrorBoundary.wrap(Library)
      },
      {
        section: 'DIVIDER'
      },
      {
        section: 'CUSTOM',
        element: ErrorBoundary.wrap(ModeSwitch)
      },
      ...Core.getAllModules(true).map(module => ({
        section: module.id,
        label: module.name,
        className: module.parent ? 'BA__nestedTabBarItem' : undefined,
        icon: module.parent ? <SpineIcon /> : undefined,
        elementProps: { moduleId: module.id },
        element: ErrorBoundary.wrap(ModuleSettings),
        notice
      })),
      {
        section: 'DIVIDER'
      },
      {
        section: SettingsSection.General,
        label: 'General',
        icon: <SettingsIcon size="xs" color="currentColor" />,
        element: ErrorBoundary.wrap(GeneralSettings),
        notice
      }
    ]
  }, [hasIssues])
}
