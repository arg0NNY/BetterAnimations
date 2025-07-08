import Patcher from '@/modules/Patcher'
import { ModalBackdrop, TransitionGroup } from '@discord/modules'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import findInReactTree from '@/utils/findInReactTree'
import AnimeTransition from '@components/AnimeTransition'
import useWindow from '@/hooks/useWindow'
import { ErrorBoundary } from '@error/boundary'
import { omit } from '@utils/object'
import { Fragment } from 'react'

function patchModalBackdrop () {
  Patcher.after(ModuleKey.ModalsBackdrop, ModalBackdrop, 'render', (self, [{ isVisible }], value) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.ModalsBackdrop)
    if (!isMainWindow || !module.isEnabled()) return

    const fragment = findInReactTree(value, m => m?.type === Fragment)
    if (!fragment) return

    const backdrop = fragment.props.children.find(Boolean)
    fragment.props.children = (
      <ErrorBoundary module={module} fallback={backdrop}>
        <TransitionGroup component={null}>
          {backdrop && isVisible && (
            <AnimeTransition
              appear={true}
              module={module}
              injectContainerRef={true}
              defaultLayoutStyles={false}
            >
              <div {...omit(backdrop.props, ['style'])}>
                <div className="BA__backdrop" />
              </div>
            </AnimeTransition>
          )}
        </TransitionGroup>
      </ErrorBoundary>
    )
  })
}

export default patchModalBackdrop
