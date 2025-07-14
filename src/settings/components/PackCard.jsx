import PackContent from '@/settings/components/PackContent'
import { css } from '@style'
import { ModalActions } from '@discord/modules'
import PackModal from '@/settings/components/PackModal'

function PackCard () {
  const onClick = () => ModalActions.openModal(props => (
    <PackModal {...props} />
  ))

  return (
    <div
      className="BA__packCard"
      onClick={onClick}
    >
      <PackContent className="BA__packCardContent" />
    </div>
  )
}

export default PackCard

css
`.BA__packCard {
    color: var(--background-base-lowest);
    background-color: currentColor;
    box-shadow: 0 0 0 1px var(--border-subtle);
    border-radius: 16px;
    cursor: pointer;
    overflow: clip;
    position: relative;
    display: flex;
    flex-direction: column;
    transition: color .2s ease;
}
.BA__packCard:hover {
    color: var(--background-base-lower);
}
.BA__packCardContent {
    flex: 1;
}`
`PackCard`
