import Patcher from '@/modules/Patcher'
import { ModalBackdrop } from '@discord/modules'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import findInReactTree from '@/utils/findInReactTree'
import AnimeTransition from '@components/AnimeTransition'
import useWindow from '@/hooks/useWindow'
import { ErrorBoundary } from '@error/boundary'
import { omit } from '@utils/object'
import { Fragment } from 'react'

function patchModalBackdrop () {
  Patcher.instead(ModuleKey.ModalsBackdrop, ModalBackdrop, 'render', (self, [props, ref], original) => {
    const fallback = original(props, ref)
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.ModalsBackdrop)
    if (!isMainWindow || !module.isEnabled()) return fallback

    const value = original({ ...props, isVisible: true }, ref)

    const fragment = findInReactTree(value, m => m?.type === Fragment)
    if (!fragment) return fallback

    const [backdrop] = fragment.props.children
    fragment.props.children[0] = (
      <AnimeTransition
        appear={true}
        in={props.isVisible}
        module={module}
        injectContainerRef={true}
      >
        <div {...omit(backdrop.props, ['style'])}>
          <div className="BA__backdrop" />
        </div>
      </AnimeTransition>
    )

    return (
      <ErrorBoundary module={module} fallback={fallback}>
        {value}
      </ErrorBoundary>
    )
  })
}

export default patchModalBackdrop
