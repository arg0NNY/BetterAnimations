import WIP from '@/settings/components/WIP'
import CreateUpsellBanner from '@/settings/components/CreateUpsellBanner'
import { css } from '@style'
import { FormTitle, FormTitleTags, Paginator, SearchBar, StandardSidebarViewKeyed, Text } from '@discord/modules'
import DiscordSelectors from '@discord/selectors'
import PackCard from '@/settings/components/PackCard'
import { useState } from 'react'

function Catalog () {
  const [query, setQuery] = useState('')

  return (
    <div className="BA__catalog">
      <div class="BA__catalogHeader">
        <Text variant="heading-xl/semibold">Catalog</Text>
        <SearchBar
          className="BA__catalogSearchBar"
          query={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
          onSubmit={() => {}}
          onBlur={() => {}}
          placeholder="Search"
          size={SearchBar.Sizes.MEDIUM}
        />
      </div>
      <div class="BA__catalogList">
        <PackCard />
        <PackCard />
        <PackCard />
        <PackCard />
      </div>
      <Paginator
        pageSize={10}
        totalCount={40}
        maxVisiblePages={5}
        currentPage={1}
        onPageChange={() => {}}
      />
      <CreateUpsellBanner className="BA__catalogBanner" />
    </div>
  )
}

export default Catalog

css
`.BA__catalogHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 32px;
}
.BA__catalogSearchBar {
    max-width: 260px;
}
.BA__catalogList {
    margin-top: 32px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}
.BA__catalogBanner {
    margin-top: 52px;
}`
`Catalog`
