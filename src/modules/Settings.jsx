import { LayerActions, LayerStore, UserSettingsModal } from '@/modules/DiscordModules'
import SettingsModal from '@/modules/settingsRefresh/SettingsModal'

export default new class Settings {

  isSettingsModalOpen () {
    return !!LayerStore.getLayers().at(-1)?.__BA_isSettingsModal
  }

  openSettingsModal (section) {
    if (this.isSettingsModalOpen()) return

    if (!LayerStore.getLayers().includes('USER_SETTINGS'))
      UserSettingsModal.open('plugins')

    const component = () => <SettingsModal initialSection={section} />
    component.__BA_isSettingsModal = true
    LayerActions.pushLayer(component)
  }

  closeSettingsModal () {
    if (this.isSettingsModalOpen())
      LayerActions.popLayer()
  }

}
