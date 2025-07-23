import { useRef, useState } from 'react'
import { Button, Paginator, Popout, SearchBar, Spinner, Text } from '@discord/modules'
import PackCard from '@/settings/components/PackCard'
import { css } from '@style'
import NoPacksPlaceholder from '@/settings/components/NoPacksPlaceholder'
import ErrorCard from '@/error/components/ErrorCard'
import ArrowSmallUpDownIcon from '@/settings/components/icons/ArrowSmallUpDownIcon'
import { ContextMenu } from '@/BdApi'

export const defaultSortOptions = [
  {
    value: 'name',
    label: 'Name',
    compare: (a, b) => a.name.localeCompare(b.name)
  },
  {
    value: 'author',
    label: 'Author',
    compare: (a, b) => a.author.localeCompare(b.author)
  }
]

export const defaultSearchableFields = ['name', 'author', 'description']

function PackListView ({
  title,
  items,
  pending = false,
  error = null,
  location,
  empty = <NoPacksPlaceholder />,
  actions,
  sortOptions = defaultSortOptions,
  searchableFields = defaultSearchableFields,
  leading,
  trailing
}) {
  const sortButtonRef = useRef()

  const [query, setQuery] = useState('')
  const trimmedQuery = query.trim()

  const [sort, setSort] = useState(sortOptions[0].value)
  const selectedSort = sortOptions.find(o => o.value === sort)

  const displayedItems = items
    .filter(
      item => !trimmedQuery
        || searchableFields.some(
          field => typeof item[field] === 'string'
            && item[field].toLowerCase().includes(trimmedQuery.toLowerCase())
        )
    )
    .sort(selectedSort?.compare ?? (() => 0))

  return (
    <div className="BA__packListView">
      <div className="BA__packListViewHeader">
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
      <div className="BA__packListViewActionBar">
        {actions && (
          <div className="BA__packListViewActions">
            {actions}
          </div>
        )}
        <Popout
          targetElementRef={sortButtonRef}
          position="bottom"
          align="right"
          renderPopout={props => (
            <ContextMenu.Menu {...props}>
              <ContextMenu.Group label="Sort by">
                {sortOptions.map(option => (
                  <ContextMenu.RadioItem
                    key={option.value}
                    id={`sort-${option.value}`}
                    group="sort"
                    label={option.label}
                    checked={option.value === sort}
                    action={() => setSort(option.value)}
                  />
                ))}
              </ContextMenu.Group>
            </ContextMenu.Menu>
          )}
        >
          {props => (
            <Button
              {...props}
              ref={sortButtonRef}
              variant="secondary"
              rounded={true}
              icon={ArrowSmallUpDownIcon}
              text={selectedSort?.label ?? 'Sort'}
            />
          )}
        </Popout>
      </div>
      {pending ? (
        <Spinner className="BA__packListViewSpinner" />
      ) : (
        error ? (
          <ErrorCard text={error} />
        ) : (
          items.length > 0 ? (
            <>
              {displayedItems.length > 0 ? (
                <>
                  <Text
                    className="BA__packListViewMeta"
                    variant="text-sm/semibold"
                    color="text-muted"
                  >
                    {displayedItems.length < items.length ? (
                      <>Displaying <b>{displayedItems.length}</b> out of {items.length} packs</>
                    ) : (
                      <>Displaying all <b>{items.length}</b> packs</>
                    )}
                  </Text>
                  {leading}
                  <div className="BA__packListViewList">
                    {displayedItems.map(pack => (
                      <PackCard
                        key={pack.filename}
                        pack={pack}
                        location={location}
                      />
                    ))}
                  </div>
                  {trailing}
                </>
              ) : (
                <NoPacksPlaceholder
                  title="No results"
                  description="There are no packs matching your search"
                  actions={[
                    <Button
                      text="Show all"
                      onClick={() => setQuery('')}
                    />
                  ]}
                />
              )}
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
.BA__packListViewActionBar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
}
.BA__packListViewActions {
    display: flex;
    align-items: center;
    gap: 4px;
}
.BA__packListViewMeta {
    margin: 16px 0;
    text-align: right;
}
.BA__packListViewMeta b {
    font-weight: inherit;
    color: var(--text-default);
}
.BA__packListViewList {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 16px;
}
.BA__packListViewSpinner {
    padding: 40px;
}`
`PackListView`
