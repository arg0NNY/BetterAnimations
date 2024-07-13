import Modules from '@/modules/Modules'
import ModuleSettings from '@/modules/settingsRefresh/components/ModuleSettings'
import SettingsSidebarHeader from '@/modules/settingsRefresh/components/SettingsSidebarHeader'

export function getSections () {
  return [
    {
      section: 'CUSTOM',
      element: SettingsSidebarHeader
    },
    ...Modules.getAllModules().map(m => ({
      section: m.id,
      label: m.name,
      element: () => <ModuleSettings module={m} />
    }))
  ]
}
