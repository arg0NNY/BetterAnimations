import { React } from '@/BdApi'
import ModuleKey from '@/enums/ModuleKey'
import { Common } from '@/modules/DiscordModules'
import DurationControl from '@/modules/Settings/components/controls/DurationControl'
import EasingControl from '@/modules/Settings/components/controls/EasingControl'
import { defaults } from '@/modules/SettingsStorage'

function ModalsGeneralSettings ({ settings, onChange }) {
  return (
    <DurationControl
      label="Backdrop transition duration"
      options={{ from: 0, to: 2000 }}
      value={settings.backdropTransitionDuration}
      onChange={duration => onChange({ backdropTransitionDuration: duration })}
      defaultValue={defaults.modules[ModuleKey.Modals].settings.backdropTransitionDuration}
    />
  )
}

function SidebarsGeneralSettings ({ settings, onChange }) {
  const defaultValues = defaults.modules[ModuleKey.Sidebars].settings

  return (
    <>
      <DurationControl
        options={{ from: 100, to: 2000 }}
        value={settings.duration}
        onChange={duration => onChange({ duration })}
        defaultValue={defaultValues.duration}
      />
      <EasingControl
        value={settings.easing}
        onChange={easing => onChange({ easing })}
        defaultValue={defaultValues.easing}
      />
    </>
  )
}

function ModuleGeneralSettings ({ module, settings, onChange }) {
  const Component = {
    [ModuleKey.Modals]: ModalsGeneralSettings,
    [ModuleKey.Sidebars]: SidebarsGeneralSettings
  }[module.id]
  if (!Component) return null

  const setSettings = values => onChange(Object.assign({}, settings, values))

  return (
    <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>
      <Common.FormTitle tag="h4">General settings</Common.FormTitle>
      <Component settings={settings} onChange={setSettings} />
    </div>
  )
}

export default ModuleGeneralSettings
