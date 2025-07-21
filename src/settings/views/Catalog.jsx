import CreateUpsellBanner from '@/settings/components/CreateUpsellBanner'
import { css } from '@style'
import PackListView from '@/settings/components/PackListView'
import { Alert, AlertTypes, Button, Tooltip } from '@discord/modules'
import RefreshIcon from '@/settings/components/icons/RefreshIcon'
import usePackRegistry from '@/hooks/usePackRegistry'
import { PackContentLocation } from '@/settings/components/PackContent'
import NoPacksPlaceholder from '@/settings/components/NoPacksPlaceholder'
import Messages from '@shared/messages'

function Catalog () {
  const registry = usePackRegistry()

  return (
    <PackListView
      title="Catalog"
      items={registry.items}
      pending={registry.isPending()}
      error={registry.isFatal && 'Failed to load packs. Please try again later.'}
      empty={(
        <NoPacksPlaceholder
          title="No packs at the time"
          description="Please come back later"
          actions={false}
        />
      )}
      location={PackContentLocation.CATALOG}
      actions={(
        <>
          <Tooltip text="Refresh">
            {props => (
              <Button
                {...props}
                variant="icon-only"
                icon={RefreshIcon}
                onClick={() => registry.updateRegistry()}
                disabled={registry.isPending()}
              />
            )}
          </Tooltip>
        </>
      )}
      leading={registry.hasError && (
        <Alert messageType={AlertTypes.ERROR}>{Messages.CATALOG_OUT_OF_DATE}</Alert>
      )}
      trailing={(
        <CreateUpsellBanner className="BA__catalogBanner" />
      )}
    />
  )
}

export default Catalog

css
` .BA__catalogBanner {
    margin-top: 52px;
}`
`Catalog`
