import { Common, Router } from '@/modules/DiscordModules'
import Home from '@/modules/Settings/views/Home'
import ModuleSettings from '@/modules/Settings/views/ModuleSettings'
import Library from '@/modules/Settings/views/Library'

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
        <Router.Route exact path="/library" component={Library} />
      </Router.Switch>
    </Router.Router>
  )
}
