import WIP from '@/settings/components/WIP'
import CreateUpsellBanner from '@/settings/components/CreateUpsellBanner'
import { css } from '@style'
import { StandardSidebarViewKeyed } from '@discord/modules'
import DiscordSelectors from '@discord/selectors'

function Catalog () {
  return (
    <div className="BA__catalog">
      <CreateUpsellBanner />
      <WIP name="Catalog" />
    </div>
  )
}

export default Catalog

StandardSidebarViewKeyed.then(() =>
css
`${DiscordSelectors.StandardSidebarView.contentColumn}:has(> .BA__catalog) {
    display: flex;
    align-items: stretch;
}

.BA__catalog {
    width: 100%;
    display: flex;
    flex-direction: column;
}
.BA__catalog .BA__wip {
    margin: auto 0;
}`
`Catalog`
)
