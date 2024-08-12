import { Dispatcher, Flux } from '@/modules/DiscordModules'
import Emitter from '@/modules/Emitter'
import Events from '@/enums/Events'
import Config from '@/modules/Config'
import DispatcherEvents from '@/enums/DispatcherEvents'

const preventCloseEvents = new Set()

function handleAddPreventSettingsClose ({ callback }) {
  preventCloseEvents.add(callback)
}

function handleRemovePreventSettingsClose ({ callback }) {
  preventCloseEvents.delete(callback)
}

export default new class SettingsStore extends Flux.Store {
  initialize () {
    [
      Events.ModuleToggled,
      Events.ModuleSettingsChanged,
      Events.SettingsChanged,
      Events.SettingsSaved
    ].forEach(event => Emitter.on(event, this.emitChange.bind(this)))
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
  [DispatcherEvents.REMOVE_PREVENT_SETTINGS_CLOSE]: handleRemovePreventSettingsClose
})
