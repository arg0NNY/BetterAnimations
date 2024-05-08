import { History, ModalActions } from '@/modules/DiscordModules'
import SettingsModal from '@/modules/settings/SettingsModal'
import anime from 'animejs'

export default new class Settings {

  constructor () {
    this.history = History.createMemoryHistory()
  }

  openSettingsModal () {
    this.history.push('/')

    ModalActions.openModal(props => (
      <SettingsModal {...props} history={this.history} />
    ), {
      onCloseRequest: () => { // Disable dismissing
        anime({
          targets: '.BA__settingsModal',
          scale: [1, 1.025],
          duration: 50,
          direction: 'alternate',
          easing: 'easeInOutSine'
        })
      }
    })
  }

}
