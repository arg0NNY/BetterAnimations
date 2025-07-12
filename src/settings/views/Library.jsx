import WIP from '@/settings/components/WIP'
import { css } from '@style'
import { StandardSidebarViewKeyed } from '@discord/modules'
import DiscordSelectors from '@discord/selectors'

function Library () {
  return (
    <div className="BA__library">
      <WIP name="Library" />
    </div>
  )
}

export default Library

StandardSidebarViewKeyed.then(() =>
css
`${DiscordSelectors.StandardSidebarView.contentColumn}:has(> .BA__library) {
    display: flex;
    align-items: stretch;
}

.BA__library {
    width: 100%;
    display: flex;
    flex-direction: column;
}
.BA__library .BA__wip {
    margin: auto 0;
}`
`Library`
)
