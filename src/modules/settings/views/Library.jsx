import { Common } from '@/modules/DiscordModules'
import AddonList from '@/modules/settings/components/AddonList'

export default function Library () {
  return (
    <div>
      <Common.FormTitle tag="h2">Library</Common.FormTitle>
      <AddonList />
    </div>
  )
}
