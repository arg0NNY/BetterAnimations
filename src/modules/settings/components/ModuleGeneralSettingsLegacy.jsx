import { React } from '@/BdApi'
import ModuleKey from '@/enums/ModuleKey'
import { Common } from '@/modules/DiscordModules'
import DurationControl from '@/modules/settings/components/controls/DurationControl'
import Config from '@/modules/Config'

function ModalsGeneralSettings ({ settings, onChange }) {
  return (
    <DurationControl
      label="Backdrop transition duration"
      options={{ from: 0, to: 2000 }}
      value={settings.backdropTransitionDuration}
      onChange={duration => onChange({ backdropTransitionDuration: duration })}
      defaultValue={Config.defaults.modules[ModuleKey.Modals].settings.backdropTransitionDuration}
    />
  )
}

function ModuleGeneralSettingsLegacy ({ module, settings, onChange }) {
  const Component = {
    [ModuleKey.Modals]: ModalsGeneralSettings
  }[module.id]
  if (!Component) return null

  const setSettings = values => onChange(Object.assign({}, settings, values))

  return (
    <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>
      <Common.FormTitle tag="h4">General settings (Legacy)</Common.FormTitle>
      <Component settings={settings} onChange={setSettings} />
    </div>
  )
}

export default ModuleGeneralSettingsLegacy
