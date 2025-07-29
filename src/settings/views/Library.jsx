import usePackRegistry from '@/hooks/usePackRegistry'
import PackListView from '@/settings/components/PackListView'
import PackManager from '@/modules/PackManager'
import { PackContentLocation } from '@/settings/components/PackContent'
import { Alert, AlertTypes, Button, Tooltip } from '@discord/modules'
import RefreshIcon from '@/components/icons/RefreshIcon'
import DownloadIcon from '@/components/icons/DownloadIcon'
import NoPacksPlaceholder from '@/settings/components/NoPacksPlaceholder'
import CircleWarningIcon from '@/components/icons/CircleWarningIcon'
import Messages from '@shared/messages'
import Core from '@/modules/Core'
import FolderIcon from '@/components/icons/FolderIcon'
import { path } from '@/modules/Node'
import { useData } from '@/modules/Data'
import { defaultSortOptions } from '@/settings/hooks/usePackSearch'
import PackRegistry from '@/modules/PackRegistry'

const usageCompare = (a, b) => Core.getModulesUsingPack(b).length - Core.getModulesUsingPack(a).length

export const librarySortOptions = [
  {
    value: 'default',
    label: 'Default',
    compare: (a, b) => {
      const [hasUpdateA, hasUpdateB] = [a, b].map(pack => PackRegistry.hasUpdate(pack))
      if (hasUpdateA !== hasUpdateB) return hasUpdateA ? -1 : 1
      return usageCompare(a, b)
    }
  },
  {
    value: 'usage',
    label: 'By usage',
    compare: usageCompare
  },
  ...defaultSortOptions
]

function Library () {
  const registry = usePackRegistry()
  const [data] = useData('library')

  return (
    <PackListView
      title="Library"
      items={PackManager.getAllPacks(true)}
      sortOptions={librarySortOptions}
      data={data}
      adjective="installed"
      empty={(
        <NoPacksPlaceholder actions={['catalog']} />
      )}
      actions={(
        <>
          {registry.verifier.hasIssues() && (
            <Button
              variant="critical-primary"
              icon={CircleWarningIcon}
              text="Resolve issues"
              onClick={() => registry.verifier.showModal()}
            />
          )}
          {registry.hasOutdatedPacks() && (
            <Button
              icon={DownloadIcon}
              text="Update all"
              onClick={() => registry.updateAll()}
              loading={registry.hasPending}
              disabled={registry.hasPending}
            />
          )}
          <Tooltip text="Open Pack Directory">
            {props => (
              <Button
                {...props}
                variant="icon-only"
                icon={FolderIcon}
                onClick={() => DiscordNative.fileManager.showItemInFolder(
                  path.resolve(PackManager.addonFolder, PackManager.addonList[0]?.filename ?? './')
                )}
              />
            )}
          </Tooltip>
          <Tooltip text="Check for updates">
            {props => (
              <Button
                {...props}
                variant="icon-only"
                icon={RefreshIcon}
                onClick={() => registry.checkForUpdates({ useToasts: true })}
                loading={registry.isPending()}
                disabled={registry.isPending()}
              />
            )}
          </Tooltip>
        </>
      )}
      location={PackContentLocation.LIBRARY}
      leading={registry.hasError && (
        <Alert messageType={AlertTypes.ERROR}>{Messages.CATALOG_OUT_OF_DATE}</Alert>
      )}
    />
  )
}

export default Library
