import PackHeader from '@/settings/components/pack/PackHeader'
import {
  Clickable,
  colors,
  ListNavigatorContainer,
  ListNavigatorProvider,
  Popout,
  SearchBar,
  Text,
  useFocusLock,
  useListItem,
  useListNavigator
} from '@discord/modules'
import classNames from 'classnames'
import { css } from '@style'
import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import useElementBounding from '@/hooks/useElementBounding'
import PackSplash from '@/settings/components/pack/PackSplash'
import DiscordClasses from '@discord/classes'
import ChevronSmallDownIcon from '@/components/icons/ChevronSmallDownIcon'
import ChevronSmallUpIcon from '@/components/icons/ChevronSmallUpIcon'
import useRafFn from '@/hooks/useRafFn'
import SortSelect from '@/settings/components/SortSelect'
import { librarySortOptions } from '@/settings/views/Library'
import usePackSearch from '@/settings/hooks/usePackSearch'
import { useData } from '@/modules/Data'
import { ErrorBoundary } from '@error/boundary'

export const packSelectSortOptions = librarySortOptions
  .filter(option => ['usage', 'name'].includes(option.value))

function scrollIntoView (el) {
  if (typeof el === 'string') el = document.querySelector(el)
  if (!el) return

  if (typeof el.scrollIntoViewIfNeeded === 'function') el.scrollIntoViewIfNeeded(false)
  else el.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}

function PackSelectContent ({ pack }) {
  return (
    <div className="BA__packSelectContent">
      <PackSplash pack={pack} />
      <div className="BA__packSelectContentContainer">
        <PackHeader
          pack={pack}
          size="sm"
          popoutType="tooltip"
        />
        {pack.description && (
          <Text
            className="BA__packSelectContentDescription"
            variant="text-sm/medium"
            color="text-muted"
            lineClamp={2}
          >
            {pack.description}
          </Text>
        )}
      </div>
    </div>
  )
}

function PackSelectOption ({ pack, selected = false, focused = false, active = false, onClick }) {
  const props = useListItem(pack.slug)

  return (
    <Clickable
      {...props}
      className={classNames({
        'BA__packSelectOption': true,
        'BA__packSelectOption--focused': focused,
        'BA__packSelectOption--selected': selected
      })}
      onClick={onClick}
      focusProps={{ enabled: false }}
      role="option"
    >
      <PackSelectContent pack={pack} />
      <div className="BA__packSelectTrailing">
        {active && <div className="BA__packSelectActiveDot" />}
      </div>
    </Clickable>
  )
}

function PackSelectPopout ({ selectRef, packs, selected, onSelect, isActive, updatePosition }) {
  const popoutRef = useRef()
  const scrollerRef = useRef()

  const { width } = useElementBounding(selectRef)
  useRafFn(updatePosition) // That's literally how Discord does it :facepalm:

  const [focused, setFocused] = useState(selected)
  const setFocus = useCallback((selector, slug) => {
    setFocused(slug)
    scrollIntoView(selector)
  }, [setFocused])
  const scrollToStart = useCallback(() => new Promise(resolve => {
    scrollerRef.current?.scrollTo({ top: 0 })
    requestAnimationFrame(resolve)
  }), [scrollerRef])
  const scrollToEnd = useCallback(() => new Promise(resolve => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current?.scrollHeight })
    requestAnimationFrame(resolve)
  }), [scrollerRef])

  const id = useId()
  const navigator = useListNavigator({
    id,
    isEnabled: true,
    wrap: true,
    defaultFocused: selected,
    useVirtualFocus: true,
    setFocus,
    scrollToStart,
    scrollToEnd,
    disableClickOnSpace: true
  })

  useLayoutEffect(() => scrollIntoView(`[data-list-item-id="${id}___${selected}"]`), [])

  useFocusLock(popoutRef)

  const [preferences] = useData('preferences')
  const {
    items,
    query,
    setQuery,
    sort,
    setSort,
    sortOptions
  } = usePackSearch(packs, {
    searchableFields: ['name', 'description'],
    sort: {
      options: packSelectSortOptions,
      preference: preferences.sort,
      setPreference: value => preferences.sort = value
    }
  })

  return (
    <ListNavigatorProvider navigator={navigator}>
      <div
        ref={popoutRef}
        className="BA__packSelectPopout"
        style={{ width }}
        onKeyDown={navigator.containerProps.onKeyDown}
      >
        <ErrorBoundary noop>
          <div className="BA__packSelectPopoutHeader">
            <SearchBar
              placeholder="Search"
              size="md"
              query={query}
              onChange={setQuery}
              onClear={() => setQuery('')}
              autoFocus={true}
            />
            <SortSelect
              options={sortOptions}
              value={sort}
              onChange={setSort}
            />
          </div>
        </ErrorBoundary>
        <ListNavigatorContainer>
          {({ ref, ...props }) => (
            <div
              {...props}
              ref={el => {
                ref.current = el
                scrollerRef.current = el
              }}
              className={classNames(
                'BA__packSelectPopoutScroller',
                DiscordClasses.Scroller.thin
              )}
              role="listbox"
            >
              {items.map(item => (
                <PackSelectOption
                  key={item.slug}
                  pack={item}
                  selected={item.slug === selected}
                  focused={item.slug === focused}
                  active={isActive?.(item)}
                  onClick={() => onSelect(item)}
                />
              ))}
            </div>
          )}
        </ListNavigatorContainer>
      </div>
    </ListNavigatorProvider>
  )
}

function PackSelect ({ packs, selected, onSelect, className, isActive }) {
  const selectRef = useRef()

  const selectedPack = packs.find(pack => pack.slug === selected)

  return (
    <Popout
      targetElementRef={selectRef}
      position="bottom"
      align="center"
      clickTrap
      renderPopout={({ closePopout, updatePosition }) => (
        <PackSelectPopout
          selectRef={selectRef}
          packs={packs}
          selected={selected}
          onSelect={pack => {
            onSelect(pack)
            closePopout()
          }}
          isActive={isActive}
          updatePosition={updatePosition}
        />
      )}
    >
      {(props, { isShown }) => (
        <Clickable
          {...props}
          innerRef={selectRef}
          className={classNames('BA__packSelect', className)}
        >
          {selectedPack ? (
            <PackSelectContent
              key={selectedPack.slug}
              pack={selectedPack}
            />
          ) : (
            <Text
              className="BA__packSelectPlaceholder"
              variant="text-md/normal"
              color="text-muted"
            >
              Select pack
            </Text>
          )}
          <div className="BA__packSelectTrailing">
            {isShown ? (
              <ChevronSmallUpIcon
                size="md"
                color={colors.INTERACTIVE_ICON_DEFAULT}
              />
            ) : (
              <ChevronSmallDownIcon
                size="md"
                color={colors.INTERACTIVE_ICON_DEFAULT}
              />
            )}
          </div>
        </Clickable>
      )}
    </Popout>
  )
}

export default PackSelect

css
`.BA__packSelect {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border-radius: 8px;
    background-color: var(--background-base-lowest);
    box-shadow: 0 0 0 1px var(--border-subtle);
    transition: background-color .2s;
    min-height: 84px;
    overflow: hidden;
}
.BA__packSelect:hover {
    background-color: var(--background-base-lower);
}
.BA__packSelectPlaceholder {
    padding-left: 16px;
}

.BA__packSelectPopout {
    display: flex;
    flex-direction: column;
    max-height: 360px;
    border-radius: 8px;
    background-color: var(--background-base-lowest);
    box-shadow: 0 0 0 1px var(--border-subtle),
        var(--shadow-high);
    overflow: hidden;
}
.BA__packSelectPopoutHeader {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    border-bottom: 1px solid var(--border-subtle);
}
.BA__packSelectPopoutScroller {
    overflow: hidden auto;
}

.BA__packSelectOption {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    cursor: pointer;
    background-color: var(--background-base-lowest);
    transition: background-color .2s;
}
.BA__packSelectOption:is(:hover, :focus-visible),
.BA__packSelectOption--focused {
    background-color: var(--background-base-lower);
}
.BA__packSelectOption--selected {
    background-color: var(--background-base-low) !important;
}

.BA__packSelectContent {
    height: 84px;
    display: flex;
    align-items: stretch;
}
.BA__packSelectContentContainer {
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.BA__packSelectContentDescription {
    margin-top: 2px;
    word-break: break-word;
}

.BA__packSelectTrailing {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-sizing: content-box;
    width: 24px;
    padding-left: 12px;
    padding-right: 16px;
    flex-shrink: 0;
}

.BA__packSelectActiveDot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--brand-500);
}`
`PackSelect`
