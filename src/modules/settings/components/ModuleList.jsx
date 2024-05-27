import { Common, Router } from '@/modules/DiscordModules'

function ModuleList ({ items }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
      {items.map(m => (
        <Router.Link key={m.id} to={`/modules/${m.id}`}>
          <Common.Button size={Common.ButtonSizes.SMALL}>{m.name}</Common.Button>
        </Router.Link>
      ))}
    </div>
  )
}

export default ModuleList
