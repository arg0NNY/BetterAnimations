import { Common, Router } from '@/modules/DiscordModules'
import modules from '@/data/modules'

export default function Home () {
  return (
    <div>
      <Common.FormTitle tag="h2">Home</Common.FormTitle>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        {modules.map(m => (
          <Router.Link key={m.id} to={`/modules/${m.id}`}>
            <Common.Button size={Common.ButtonSizes.SMALL}>{m.name}</Common.Button>
          </Router.Link>
        ))}
      </div>
      <Router.Link to="/library">
        <Common.Button>Library</Common.Button>
      </Router.Link>
    </div>
  )
}
