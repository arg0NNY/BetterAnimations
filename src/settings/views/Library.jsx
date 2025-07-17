import usePackRegistry from '@/hooks/usePackRegistry'
import PackListView from '@/settings/components/PackListView'
import PackManager from '@/modules/PackManager'
import { PackContentLocation } from '@/settings/components/PackContent'
import { Button, Tooltip } from '@discord/modules'
import RefreshIcon from '@/settings/components/icons/RefreshIcon'
import DownloadIcon from '@/settings/components/icons/DownloadIcon'

function Library () {
  const registry = usePackRegistry()

  return (
    <PackListView
      title="Library"
      items={PackManager.getAllPacks(true)}
      actions={(
        <>
          {registry.getOutdatedPacks().length > 0 && (
            <Button
              icon={DownloadIcon}
              text="Update all"
              onClick={() => registry.updateAll()}
              loading={registry.hasPending}
              disabled={registry.hasPending}
            />
          )}
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
    />
  )
}

export default Library
