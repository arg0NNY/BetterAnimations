import Patcher from '@/modules/Patcher'
import { ModalsKeyed, TransitionGroup } from '@discord/modules'
import AnimeTransition from '@components/AnimeTransition'
import patchModalItem from '@/patches/Modals/patchModalItem'
import patchModalBackdrop from '@/patches/Modals/patchModalBackdrop'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import ensureOnce from '@utils/ensureOnce'
import { directChild } from '@utils/transition'
import { css } from '@style'
import DiscordSelectors from '@discord/selectors'
import { useMemo, useRef } from 'react'
import useWindow from '@/hooks/useWindow'

function Modal ({ children, ...props }) {
  const layerRef = useRef()
  const containerRef = useMemo(() => ({
    get current () { return directChild(layerRef.current) }
  }), [layerRef])

  children.props.layerRef = layerRef

  return (
    <AnimeTransition
      containerRef={containerRef}
      {...props}
    >
      {children}
    </AnimeTransition>
  )
}

function patchModals () {
  const once = ensureOnce()

  Patcher.after(...ModalsKeyed, (self, args, value) => {
    const modals = value.props.children[1]
    if (modals?.length) once(() => patchModalItem(modals[0].type))

    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Modals)
    if (!isMainWindow || !module.isEnabled()) return

    const modal = modals.find(m => m.props.isTopModal)

    value.props.children[1] = (
      <TransitionGroup component={null}>
        {modal && (
          <Modal
            key={modal.props.modalKey}
            module={module}
            enter={!modal.props.instant}
            exit={!modal.props.instant}
          >
            {modal}
          </Modal>
        )}
      </TransitionGroup>
    )
  })

  patchModalBackdrop()
}

export default patchModals

css
`${DiscordSelectors.Modal.root}, .bd-modal-root {
    isolation: isolate;
}

${DiscordSelectors.ModalBackdrop.backdrop} {
    position: fixed !important;
}
${DiscordSelectors.Layer.layerContainer} + ${DiscordSelectors.Layer.layerContainer} ${DiscordSelectors.ModalBackdrop.backdrop} {
    display: none;
}

${DiscordSelectors.Modal.focusLock}:has(> [class*="carouselModal"]) {
    position: absolute !important;
    inset: 0;
}

.BA__backdrop {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.7);
}`
`Modals`
