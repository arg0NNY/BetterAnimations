import Modules from '@/modules/Modules'
import ModuleSettings from '@/modules/settingsRefresh/components/ModuleSettings'
import SettingsSidebarHeader from '@/modules/settingsRefresh/components/SettingsSidebarHeader'

export function getSections () {
  return [
    {
      section: 'CUSTOM',
      element: SettingsSidebarHeader
    },
    ...Modules.getAllModules().map(module => ({
      section: module.id,
      label: module.name,
      element: () => <ModuleSettings moduleId={module.id} />
    }))
  ]
}
