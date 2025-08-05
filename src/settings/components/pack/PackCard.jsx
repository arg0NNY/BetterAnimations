import PackContent, { PackContentLocation } from '@/settings/components/pack/PackContent'
import { css } from '@style'
import { Clickable, ModalActions, useIsVisible } from '@discord/modules'
import PackModal from '@/settings/components/pack/PackModal'
import PackRegistry from '@/modules/PackRegistry'
import { useCallback } from 'react'

function PackCard ({ pack, location = PackContentLocation.CATALOG }) {
  const onClick = () => ModalActions.openModal(props => (
    <PackModal
      {...props}
      filename={pack.filename}
      location={location}
    />
  ))

  const onIntersection = useCallback(isIntersecting => {
    if (location === PackContentLocation.CATALOG && isIntersecting)
      PackRegistry.markAsKnown(pack)
  }, [pack, location])

  const cardRef = useIsVisible(onIntersection, .5)

  return (
    <Clickable
      tag="div"
      innerRef={cardRef}
      className="BA__packCard"
      onClick={onClick}
    >
      <PackContent
        className="BA__packCardContent"
        pack={pack}
        location={location}
        size="sm"
      />
    </Clickable>
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
