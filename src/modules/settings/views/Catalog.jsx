import WIP from '@/modules/settings/components/WIP'
import CreateUpsellBanner from '@/modules/settings/components/CreateUpsellBanner'
import { css } from '@/modules/Style'

function Catalog () {
  return (
    <div className="BA__catalog">
      <CreateUpsellBanner />
      <WIP name="Catalog" />
    </div>
  )
}

export default Catalog

css
`:has(> .BA__catalog) {
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
