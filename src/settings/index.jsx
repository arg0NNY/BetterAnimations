import { LayerStore, popLayer, pushLayer, UserSettingsModal } from '@discord/modules'
import SettingsModal from '@/settings/SettingsModal'
import SettingsSection from '@enums/SettingsSection'
import { setSection } from '@/settings/stores/SettingsStore'

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
    pushLayer(component)
  }

  closeSettingsModal () {
    if (this.isSettingsModalOpen())
      popLayer()
  }

}
