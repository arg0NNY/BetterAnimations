import Enum from '@shared/enum'

export default Enum({
  PackLoaded: 'pack-loaded',
  PackUnloaded: 'pack-unloaded',
  PackEnabled: 'pack-enabled',
  PackDisabled: 'pack-disabled',
  PackUpdated: 'pack-updated',
  ModuleToggled: 'module-toggled',
  ModuleSettingsChanged: 'module-settings-changed',
  SettingsChanged: 'settings-changed',
  SettingsLoaded: 'settings-loaded',
  SettingsSaved: 'settings-saved',
  PackRegistryUpdated: 'pack-registry-updated',
  SettingsModeChanged: 'settings-mode-changed',
  DismissibleUpdated: 'dismissible-updated',
  ErrorOccurred: 'error-occurred'
})
