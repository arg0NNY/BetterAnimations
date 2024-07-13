import { React } from '@/BdApi'
import { LayerActions, LayerStore } from '@/modules/DiscordModules'
import SettingsModal from '@/modules/settingsRefresh/SettingsModal'

export default new class Settings {

  openSettingsModal (section) {
    const component = () => <SettingsModal initialSection={section} />
    component.__BA_isSettingsModal = true
    LayerActions.pushLayer(component)
  }

  closeSettingsModal () {
    if (LayerStore.getLayers().at(-1)?.__BA_isSettingsModal)
      LayerActions.popLayer()
  }

}
