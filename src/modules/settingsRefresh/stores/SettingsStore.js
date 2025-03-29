import { Dispatcher, Flux, useStateFromStores } from '@/modules/DiscordModules'
import Emitter from '@/modules/Emitter'
import Events from '@/enums/Events'
import Config from '@/modules/Config'
import DispatcherEvents from '@/enums/DispatcherEvents'
import SettingsSection from '@/enums/SettingsSection'

let section = SettingsSection.Home
const preventCloseEvents = new Set()

function handleSetSection ({ section: _section }) {
  section = _section
}

function handleAddPreventSettingsClose ({ callback }) {
  preventCloseEvents.add(callback)
}

function handleRemovePreventSettingsClose ({ callback }) {
  preventCloseEvents.delete(callback)
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

  shouldPreventClose () {
    return preventCloseEvents.size > 0
  }

  preventCloseIfNeeded () {
    if (!this.shouldPreventClose()) return false

    preventCloseEvents.forEach(callback => callback())
    return true
  }

  // Used by StandardSidebarView
  canCloseEarly () {
    return this.shouldPreventClose()
  }
}(Dispatcher, {
  [DispatcherEvents.ADD_PREVENT_SETTINGS_CLOSE]: handleAddPreventSettingsClose,
  [DispatcherEvents.REMOVE_PREVENT_SETTINGS_CLOSE]: handleRemovePreventSettingsClose,
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
