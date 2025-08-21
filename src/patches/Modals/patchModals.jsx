import Patcher from '@/modules/Patcher'
import { ModalsKeyed, Transition, TransitionGroup } from '@discord/modules'
import AnimeTransition from '@components/AnimeTransition'
import patchModalItem from '@/patches/Modals/patchModalItem'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import ensureOnce from '@utils/ensureOnce'
import { directChild } from '@utils/transition'
import { css } from '@style'
import DiscordSelectors from '@discord/selectors'
import { cloneElement, useMemo, useRef } from 'react'
import useWindow from '@/hooks/useWindow'
import { ErrorBoundary } from '@error/boundary'
import useTransitionCustomCondition from '@/hooks/useTransitionCustomCondition'
import patchManaModalRoot from '@/patches/Modals/patchManaModalRoot'
import patchModalScrim from '@/patches/Modals/patchModalScrim'

function Modal ({ modal, ...props }) {
  const layerRef = useRef()
  const containerRef = useMemo(() => ({
    get current () {
      return layerRef.current?.querySelector(`[data-ba-container="${ModuleKey.Modals}"]`)
        ?? directChild(layerRef.current)
    }
  }), [layerRef])

  const isShown = useTransitionCustomCondition(modal.props.isVisible, props)

  return (
    <AnimeTransition
      {...props}
      in={isShown}
      containerRef={containerRef}
      enter={!modal.props.instant}
      exit={!modal.props.instant}
      mountOnEnter={false}
      unmountOnExit={false}
    >
      {state => cloneElement(modal, {
        layerRef,
        hidden: state === Transition.EXITED && !modal.props.isVisible,
        instant: true // Disable Discord's internal modal animations
      })}
    </AnimeTransition>
  )
}

function patchModals () {
  const once = ensureOnce()

  Patcher.after(ModuleKey.Modals, ...ModalsKeyed, (self, args, value) => {
    const modals = value.props.children[1]
    if (modals?.length) once(() => patchModalItem(modals[0].type))

    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Modals)
    if (!isMainWindow || !module.isEnabled()) return

    value.props.children[1] = (
      <ErrorBoundary module={module} fallback={modals}>
        <TransitionGroup component={null}>
          {modals.map(modal => (
            <Modal
              key={modal.props.modalKey}
              module={module}
              modal={modal}
            />
          ))}
        </TransitionGroup>
      </ErrorBoundary>
    )
  })

  patchModalScrim()
  patchManaModalRoot()
}

export default patchModals

css
`${DiscordSelectors.Modal.root}, .bd-modal-root {
    isolation: isolate;
}
${DiscordSelectors.Modal.focusLock}:has(> [class*="carouselModal"]) {
    position: absolute !important;
    inset: 0;
}
.BA__modal--hidden {
    visibility: hidden;
    pointer-events: none;
}`
`Modals`
