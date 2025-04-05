import { Common } from '@/modules/DiscordModules'
import AddonList from '@/modules/settingsLegacy/components/AddonList'
import usePackRegistry from '@/hooks/usePackRegistry'
import { DiscordClasses } from '@/modules/DiscordSelectors'

function Catalog () {
  const PackRegistry = usePackRegistry()

  return (
    <div>
      <Common.FormTitle tag="h2">Catalog</Common.FormTitle>
      <Common.Button onClick={() => PackRegistry.updateRegistry()} className={DiscordClasses.Margins.marginBottom20}>Refresh</Common.Button>
      {
        PackRegistry.pending
          ? <Common.Text>Loading...</Common.Text>
          : <AddonList getList={() => PackRegistry.items} />
      }
    </div>
  )
}

export default Catalog
