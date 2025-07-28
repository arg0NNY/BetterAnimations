import CreateUpsellBanner from '@/settings/components/CreateUpsellBanner'
import { css } from '@style'
import PackListView from '@/settings/components/PackListView'
import { Alert, AlertTypes, Button, handleClick, Tooltip } from '@discord/modules'
import RefreshIcon from '@/settings/components/icons/RefreshIcon'
import usePackRegistry from '@/hooks/usePackRegistry'
import { PackContentLocation } from '@/settings/components/PackContent'
import NoPacksPlaceholder from '@/settings/components/NoPacksPlaceholder'
import Messages from '@shared/messages'
import GitHubIcon from '@/settings/components/icons/GitHubIcon'
import { useData } from '@/modules/Data'
import { useEffect } from 'react'
import { defaultSortOptions } from '@/settings/hooks/usePackSearch'

export const catalogSortOptions = [
  {
    value: 'newest',
    label: 'Newest first',
    compare: (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  },
  {
    value: 'oldest',
    label: 'Oldest first',
    compare: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  },
  {
    value: 'official',
    label: 'Official first',
    compare: (a, b) => b.official - a.official
  },
  ...defaultSortOptions
]

function Catalog () {
  const registry = usePackRegistry()
  const [data] = useData('catalog')

  useEffect(() => {
    if (data.visited) return

    registry.items.forEach(item => registry.markAsKnown(item))
    data.visited = true
  }, [])

  return (
    <PackListView
      title="Catalog"
      items={registry.items}
      sortOptions={catalogSortOptions}
      data={data}
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
          <Tooltip text="View on GitHub">
            {props => (
              <Button
                {...props}
                variant="icon-only"
                icon={GitHubIcon}
                onClick={() => handleClick({ href: registry.baseUrl })}
              />
            )}
          </Tooltip>
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
