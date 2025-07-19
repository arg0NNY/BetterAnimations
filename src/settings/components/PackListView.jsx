import { useState } from 'react'
import { Paginator, SearchBar, Spinner, Text } from '@discord/modules'
import PackCard from '@/settings/components/PackCard'
import { css } from '@style'
import NoPacksPlaceholder from '@/settings/components/NoPacksPlaceholder'
import ErrorCard from '@/error/components/ErrorCard'

function PackListView ({
  title,
  items,
  pending = false,
  error = null,
  location,
  empty = <NoPacksPlaceholder />,
  actions,
  after
}) {
  const [query, setQuery] = useState('')

  return (
    <div className="BA__packListView">
      <div class="BA__packListViewHeader">
        <Text variant="heading-xl/semibold">{title}</Text>
        <SearchBar
          className="BA__packListViewSearchBar"
          query={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
          onSubmit={() => {}}
          onBlur={() => {}}
          placeholder="Search"
          size={SearchBar.Sizes.MEDIUM}
        />
      </div>
      {actions && (
        <div className="BA__packListViewActions">
          {actions}
        </div>
      )}
      {pending ? (
        <Spinner className="BA__packListViewSpinner" />
      ) : (
        error ? (
          <ErrorCard text={error} />
        ) : (
          items.length > 0 ? (
            <>
              <div className="BA__packListViewList">
                {items.map(pack => (
                  <PackCard
                    key={pack.filename}
                    pack={pack}
                    location={location}
                  />
                ))}
              </div>
              {after}
              <Paginator
                pageSize={10}
                totalCount={40}
                maxVisiblePages={5}
                currentPage={1}
                onPageChange={() => {}}
              />
            </>
          ) : empty
        )
      )}
    </div>
  )
}

export default PackListView

css
`.BA__packListViewHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 32px;
    margin-bottom: 16px;
}
.BA__packListViewSearchBar {
    max-width: 260px;
}
.BA__packListViewActions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
}
.BA__packListViewList {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}
.BA__packListViewSpinner {
    padding: 40px;
}`
`PackListView`
