import ModuleKey from '@/enums/ModuleKey'
import { Common } from '@/modules/DiscordModules'
import DurationControl from '@/modules/Settings/components/controls/DurationControl'

function ModalsGeneralSettings ({ settings, onChange }) {
  return (
    <DurationControl
      label="Backdrop transition duration"
      options={{ from: 0, to: 2000 }}
      value={settings.backdropTransitionDuration}
      onChange={duration => onChange({ backdropTransitionDuration: duration })}
      defaultValue={200}
    />
  )
}

function ModuleGeneralSettings ({ module, settings, onChange }) {
  const Component = {
    [ModuleKey.Modals]: ModalsGeneralSettings
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
