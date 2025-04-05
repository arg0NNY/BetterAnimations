import { Common } from '@/modules/DiscordModules'
import PackManager from '@/modules/PackManager'
import PackRegistry from '@/modules/PackRegistry'

export default function PackItem ({ pack }) {
  const hasUpdate = pack.installed && PackRegistry.hasUpdate(pack.installed)

  const flags = [
    PackRegistry.isUnofficial(pack) && 'unofficial',
    pack.partial && 'partial'
  ].filter(Boolean).map(f => `(${f})`).join(' ')

  return (
    <Common.Card outline>
      <Common.FormTitle>{pack.name} v{pack.version} by {pack.author} {flags}</Common.FormTitle>
      <Common.FormTitle>{pack.filename}</Common.FormTitle>
      <div style={{ display: 'flex', gap: 10 }}>
        {!pack.installed && (
          <Common.Button onClick={() => PackRegistry.install(pack.filename)}>Download</Common.Button>
        )}
        {hasUpdate && (
          <Common.Button onClick={() => PackRegistry.update(pack.installed)}>Update to v{hasUpdate}</Common.Button>
        )}
        {pack.installed && (
          <Common.Button onClick={() => PackManager.deleteAddon(pack.filename)}>Delete</Common.Button>
        )}
      </div>
    </Common.Card>
  )
}
