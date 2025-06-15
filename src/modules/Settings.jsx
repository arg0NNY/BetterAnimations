import { LayerActions, LayerStore, UserSettingsModal } from '@discord/modules'
import SettingsModal from '@/modules/settings/SettingsModal'
import SettingsSection from '@enums/SettingsSection'
import { setSection } from '@/modules/settings/stores/SettingsStore'

export default new class Settings {

  isSettingsModalOpen () {
    return !!LayerStore.getLayers().at(-1)?.__BA_isSettingsModal
  }

  openSettingsModal (section = SettingsSection.Home) {
    if (this.isSettingsModalOpen()) return

    if (!LayerStore.getLayers().includes('USER_SETTINGS'))
      UserSettingsModal.open('plugins')

    setSection(section)
    const component = () => <SettingsModal />
    component.__BA_isSettingsModal = true
    LayerActions.pushLayer(component)
  }

  closeSettingsModal () {
    if (this.isSettingsModalOpen())
      LayerActions.popLayer()
  }

}
