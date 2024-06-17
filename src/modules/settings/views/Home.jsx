import { Common, Router } from '@/modules/DiscordModules'
import Modules from '@/modules/Modules'
import ModuleList from '@/modules/settings/components/ModuleList'

export default function Home () {
  return (
    <div>
      <Common.FormTitle tag="h2">Home</Common.FormTitle>
      <ModuleList items={Modules.getAllModules()} />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Router.Link to="/catalog">
          <Common.Button>Catalog</Common.Button>
        </Router.Link>
        <Router.Link to="/library">
          <Common.Button>Library</Common.Button>
        </Router.Link>
        <Router.Link to="/settings">
          <Common.Button>Settings</Common.Button>
        </Router.Link>
      </div>
    </div>
  )
}
