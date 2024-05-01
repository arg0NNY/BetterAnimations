import { Patcher } from '@/BdApi'
import { Modals, TransitionGroup } from '@/modules/DiscordModules'
import patchModalRoot from '@/patches/Modals/patchModalRoot'
import AnimeTransition from '@/components/AnimeTransition'
import { clearContainingStyles } from '@/helpers/transition'
import PassThrough from '@/components/PassThrough'
import patchModalBackdrop from '@/patches/Modals/patchModalBackdrop'
import { DiscordSelectors } from '@/modules/DiscordSelectors'
import { tempAnimationData } from '@/patches/ContextMenu/patchContextMenu'

function patchModals () {
  Patcher.after(Modals, 'Modals', (self, args, value) => {
    value.props.children[1] = (
      <TransitionGroup component={null}>
        {
          value.props.children[1].map(modal => (
            <PassThrough>
              {props => (
                <AnimeTransition
                  {...props}
                  in={modal.props.isTopModal && props.in}
                  key={modal.props.modalKey}
                  mountOnEnter={false}
                  unmountOnExit={false}
                  targetNode={node => node?.querySelector(`${DiscordSelectors.Modal.root}, .bd-modal-root`)}
                  animation={tempAnimationData}
                  enter={!modal.props.instant}
                  exit={!modal.props.instant}
                  context={{
                    duration: 200
                  }}
                  // onEntered={clearContainingStyles}
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

  patchModalRoot()
  patchModalBackdrop()
}

export default patchModals
