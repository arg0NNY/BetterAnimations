import { LayerActions, LayerStore } from '@discord/modules'
import SettingsModal from '@/settings/SettingsModal'
import SettingsSection from '@enums/SettingsSection'
import { setSection } from '@/settings/stores/SettingsStore'

export default new class Settings {

  isSettingsModalOpen () {
    return !!LayerStore.getLayers().at(-1)?.__BA_isSettingsModal
  }

  openSettingsModal (section = SettingsSection.Home) {
    if (this.isSettingsModalOpen()) return

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
