import { Common } from '@/modules/DiscordModules'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import AddonList from '@/modules/settings/components/AddonList'
import PackRegistry from '@/modules/PackRegistry'

export default function Library () {
  return (
    <div>
      <Common.FormTitle tag="h2">Library</Common.FormTitle>
      <Common.Button
        onClick={() => PackRegistry.checkForUpdates({ useToasts: true })}
        className={DiscordClasses.Margins.marginBottom20}
      >Check for Updates</Common.Button>
      <AddonList />
    </div>
  )
}
