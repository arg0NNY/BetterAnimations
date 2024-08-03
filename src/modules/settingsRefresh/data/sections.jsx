import Modules from '@/modules/Modules'
import ModuleSettings from '@/modules/settingsRefresh/components/ModuleSettings'
import SettingsSidebarHeader from '@/modules/settingsRefresh/components/SettingsSidebarHeader'
import ModeSwitch from '@/modules/settingsRefresh/components/ModeSwitch'
import { DiscordClasses } from '@/modules/DiscordSelectors'

export function getSections () {
  return [
    {
      section: 'CUSTOM',
      element: SettingsSidebarHeader
    },
    {
      section: 'CUSTOM',
      element: ModeSwitch
    },
    ...Modules.getAllModules().map(module => ({
      section: module.id,
      label: module.name,
      elementProps: { moduleId: module.id },
      element: ModuleSettings
    }))
  ]
}
