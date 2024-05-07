import { Common } from '@/modules/DiscordModules'
import PackManager from '@/modules/PackManager'

export default function PackItem ({ pack }) {
  return (
    <Common.Card outline>
      <Common.FormTitle>{pack.name} by {pack.author}</Common.FormTitle>
      <Common.Button onClick={() => PackManager.deleteAddon(pack)}>Delete</Common.Button>
    </Common.Card>
  )
}
