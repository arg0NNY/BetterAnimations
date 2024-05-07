import { History, ModalActions } from '@/modules/DiscordModules'
import SettingsModal from '@/modules/settings/SettingsModal'

export default new class Settings {

  constructor () {
    this.history = History.createMemoryHistory()
  }

  openSettingsModal () {
    this.history.push('/')

    ModalActions.openModal(props => (
      <SettingsModal {...props} history={this.history} />
    ), {
      onCloseRequest: () => {} // Disable dismissing
    })
  }

}
