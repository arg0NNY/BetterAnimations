import { Patcher } from '@/BdApi'
import { Modals, TransitionGroup } from '@/modules/DiscordModules'
import patchModalRoot from '@/patches/Modals/patchModalRoot'
import CloneTransition from '@/components/CloneTransition'
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
                <CloneTransition
                  {...props}
                  in={modal.props.isTopModal && props.in}
                  key={modal.props.modalKey}
                  mountOnEnter={false}
                  unmountOnExit={false}
                  clone={false}
                  targetNode={node => node?.querySelector(DiscordSelectors.Modal.root)}
                  animation={tempAnimationData}
                  enter={!modal.props.instant}
                  exit={!modal.props.instant}
                  context={{
                    duration: 200
                  }}
                  onEntered={clearContainingStyles}
                >
                  {modal}
                </CloneTransition>
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
