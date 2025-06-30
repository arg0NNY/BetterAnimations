import WIP from '@/settings/components/WIP'
import { css } from '@style'

function Library () {
  return (
    <div className="BA__library">
      <WIP name="Library" />
    </div>
  )
}

export default Library

css
`:has(> .BA__library) {
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
