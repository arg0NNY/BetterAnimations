import { Patcher } from '@/BdApi'
import { Modals, TransitionGroup } from '@/modules/DiscordModules'
import AnimeTransition from '@/components/AnimeTransition'
import PassThrough from '@/components/PassThrough'
import patchModalItem from '@/patches/Modals/patchModalItem'
import patchModalBackdrop from '@/patches/Modals/patchModalBackdrop'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import ensureOnce from '@/helpers/ensureOnce'
import { directChild } from '@/helpers/transition'
import { css } from '@/modules/Style'
import { DiscordSelectors } from '@/modules/DiscordSelectors'

function patchModals () {
  const once = ensureOnce()

  Patcher.after(Modals, 'Modals', (self, args, value) => {
    const modals = value.props.children[1]
    if (modals?.length) once(() => patchModalItem(modals[0].type))

    const module = useModule(ModuleKey.Modals)
    if (!module.isEnabled()) return

    const animations = module.getAnimations()

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
                  mountOnEnter={false}
                  unmountOnExit={false}
                  targetContainer={directChild}
                  // targetNode={node => node?.querySelector(`${DiscordSelectors.Modal.root}, .bd-modal-root`)}
                  animations={animations}
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
`${DiscordSelectors.Modal.focusLock}:is(:has(> [data-animation-type]), :has(> [data-animation])) {
    position: relative;
}`
`Modals`
