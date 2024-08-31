import { React } from '@/BdApi'
import { LayerActions, LayerStore, UserSettingsModal } from '@/modules/DiscordModules'
import SettingsModal from '@/modules/settingsRefresh/SettingsModal'

export default new class Settings {

  openSettingsModal (section) {
    if (!LayerStore.getLayers().includes('USER_SETTINGS'))
      UserSettingsModal.open('plugins')

    const component = () => <SettingsModal initialSection={section} />
    component.__BA_isSettingsModal = true
    LayerActions.pushLayer(component)
  }

  closeSettingsModal () {
    if (LayerStore.getLayers().at(-1)?.__BA_isSettingsModal)
      LayerActions.popLayer()
  }

}
