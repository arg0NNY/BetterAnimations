import { Dispatcher, Flux } from '@/modules/DiscordModules'
import Emitter from '@/modules/Emitter'
import Events from '@/enums/Events'
import Config from '@/modules/Config'

export default new class SettingsNoticeStore extends Flux.Store {
  initialize () {
    [
      Events.ModuleToggled,
      Events.ModuleSettingsChanged,
      Events.SettingsChanged,
      Events.SettingsSaved
    ].forEach(event => Emitter.on(event, this.emitChange.bind(this)))
  }

  showNotice () {
    return Config.hasUnsavedChanges()
  }
}(Dispatcher)
