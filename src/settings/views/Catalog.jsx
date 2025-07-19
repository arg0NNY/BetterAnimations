import CreateUpsellBanner from '@/settings/components/CreateUpsellBanner'
import { css } from '@style'
import PackListView from '@/settings/components/PackListView'
import { Button, Tooltip } from '@discord/modules'
import RefreshIcon from '@/settings/components/icons/RefreshIcon'
import usePackRegistry from '@/hooks/usePackRegistry'
import { PackContentLocation } from '@/settings/components/PackContent'
import NoPacksPlaceholder from '@/settings/components/NoPacksPlaceholder'

function Catalog () {
  const registry = usePackRegistry()

  return (
    <PackListView
      title="Catalog"
      items={registry.items}
      pending={registry.isPending()}
      error={registry.error && 'Failed to load packs. Please try again later.'}
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
      after={(
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
