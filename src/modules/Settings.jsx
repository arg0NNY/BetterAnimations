import { Common } from '@/modules/DiscordModules'
import { createMemoryHistory } from 'history'
import SettingsModal from '@/modules/settings/SettingsModal'
import anime from 'animejs'

export default new class Settings {

  constructor () {
    this.history = createMemoryHistory()
  }

  openSettingsModal (location = '/') {
    this.history.push(location)

    Common.openModal(props => (
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
