import { Patcher } from '@/BdApi'
import { Modals, TransitionGroup } from '@/modules/DiscordModules'
import AnimeTransition from '@/components/AnimeTransition'
import PassThrough from '@/components/PassThrough'
import patchModalItem from '@/patches/Modals/patchModalItem'
import patchModalBackdrop from '@/patches/Modals/patchModalBackdrop'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import ensureOnce from '@/utils/ensureOnce'
import { directChild } from '@/utils/transition'
import { css } from '@/modules/Style'
import { DiscordSelectors } from '@/modules/DiscordSelectors'

function patchModals () {
  const once = ensureOnce()

  Patcher.after(...Modals, (self, args, value) => {
    const modals = value.props.children[1]
    if (modals?.length) once(() => patchModalItem(modals[0].type))

    const module = useModule(ModuleKey.Modals)
    if (!module.isEnabled()) return

    value.props.children[1] = (
      <TransitionGroup component={null}>
        {
          modals.map(modal => (
            <PassThrough>
              {props => (
                <AnimeTransition
                  {...props}
                  in={modal.props.isTopModal && props.in}
                  key={modal.props.modalKey}
                  targetContainer={directChild}
                  // targetNode={node => node?.querySelector(`${DiscordSelectors.Modal.root}, .bd-modal-root`)}
                  module={module}
                  enter={!modal.props.instant}
                  exit={!modal.props.instant}
                >
                  {modal}
                </AnimeTransition>
              )}
            </PassThrough>
          ))
        }
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
    position: absolute;
    inset: 0;
}

.BA__modalBackdrop {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: rgba(0, 0, 0, 0.7);
}`
`Modals`
