import { DOM, ReactDOM } from '@/BdApi'
import SettingsPanel from '@/modules/Settings/SettingsPanel'
import { History } from '@/modules/DiscordModules'
import { forceAppUpdate } from '@/helpers/forceUpdate'
import { save } from '@/modules/SettingsStorage'

export default new class Settings {

  buildSettingsPanel () {
    const node = DOM.createElement('div', { id: 'BA-settings' })

    const history = History.createMemoryHistory()
    ReactDOM.render(<SettingsPanel history={history} />, node)
    DOM.onRemoved(node, () => {
      ReactDOM.unmountComponentAtNode(node)
      save()
      setTimeout(forceAppUpdate)
    })

    return node
  }

}
