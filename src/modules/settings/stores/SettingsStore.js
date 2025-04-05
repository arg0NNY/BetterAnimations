import { Dispatcher, Flux, useStateFromStores } from '@/modules/DiscordModules'
import Emitter from '@/modules/Emitter'
import Events from '@/enums/Events'
import Config from '@/modules/Config'
import DispatcherEvents from '@/enums/DispatcherEvents'
import SettingsSection from '@/enums/SettingsSection'

let section = SettingsSection.Home

function handleSetSection ({ section: _section }) {
  section = _section
}
const SettingsStore = new class SettingsStore extends Flux.Store {
  initialize () {
    [
      Events.ModuleToggled,
      Events.ModuleSettingsChanged,
      Events.SettingsChanged,
      Events.SettingsSaved
    ].forEach(event => Emitter.on(event, this.emitChange.bind(this)))
  }

  getSection () {
    return section
  }

  // Used by StandardSidebarView
  showNotice () {
    return Config.hasUnsavedChanges()
  }
}(Dispatcher, {
  [DispatcherEvents.SET_SETTINGS_SECTION]: handleSetSection
})

export function setSection (section) {
  Dispatcher.dispatch({
    type: DispatcherEvents.SET_SETTINGS_SECTION,
    section
  })
}

export function useSection () {
  return [
    useStateFromStores([SettingsStore], () => SettingsStore.getSection()),
    setSection
  ]
}

export default SettingsStore
