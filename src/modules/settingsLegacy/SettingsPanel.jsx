import { Common, Router } from '@/modules/DiscordModules'
import Home from '@/modules/settingsLegacy/views/Home'
import ModuleSettings from '@/modules/settingsLegacy/views/ModuleSettings'
import Catalog from '@/modules/settingsLegacy/views/Catalog'
import Library from '@/modules/settingsLegacy/views/Library'
import GeneralSettings from '@/modules/settingsLegacy/views/GeneralSettings'

export default function SettingsPanel ({ history }) {
  return (
    <Router.Router history={history}>
      <div style={{ marginBottom: 20 }}>
        <Router.Link to="/">
          <Common.Button>Home</Common.Button>
        </Router.Link>
      </div>

      <Router.Switch>
        <Router.Route exact path="/" component={Home} />
        <Router.Route exact path="/modules/:id" component={ModuleSettings} />
        <Router.Route exact path="/catalog" component={Catalog} />
        <Router.Route exact path="/library" component={Library} />
        <Router.Route exact path="/settings" component={GeneralSettings} />
      </Router.Switch>
    </Router.Router>
  )
}
