import { ModalCloseButton, ModalContent, ModalRoot, ModalSize } from '@discord/modules'
import { css } from '@style'
import PackContent, { PackContentLocation } from '@/settings/components/PackContent'
import { ErrorBoundary } from '@error/boundary'
import usePackRegistry from '@/hooks/usePackRegistry'
import PackManager from '@/modules/PackManager'
import { useEffect } from 'react'

function PackModal ({ filename, location = PackContentLocation.CATALOG, onClose, ...props }) {
  const registry = usePackRegistry()

  const pack = location === PackContentLocation.CATALOG
    ? registry.getPack(filename)
    : PackManager.getPackByFile(filename, true)

  useEffect(() => {
    if (!pack) onClose()
  }, [pack])

  if (!pack) return null

  return (
    <ModalRoot
      {...props}
      className="BA__packModal"
      size={ModalSize.DYNAMIC}
    >
      <ErrorBoundary>
        <div className="BA__packModalSidebar">
          <PackContent
            className="BA__packModalContent"
            pack={pack}
            location={location}
            size="md"
          />
        </div>
        <ModalContent className="BA__packModalPreview">

        </ModalContent>
        <ModalCloseButton
          className="BA__packModalClose"
          onClick={onClose}
        />
      </ErrorBoundary>
    </ModalRoot>
  )
}

export default PackModal

css
`.BA__packModal {
    display: flex;
    align-items: stretch;
    flex-direction: row;
    height: 600px;
    overflow: clip;
}
.BA__packModalSidebar {
    width: 350px;
    display: flex;
    flex-direction: column;
    background-color: var(--background-base-lowest);
}
.BA__packModalContent {
    flex: 1;
}
.BA__packModalPreview {
    padding: 0 !important;
    width: 500px;
    flex: 1;
    border-left: 1px solid var(--border-subtle);
}
.BA__packModalClose {
    position: absolute;
    top: 16px;
    right: 16px;
}`
`PackModal`
