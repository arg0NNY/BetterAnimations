import Patcher from '@/modules/Patcher'
import { BasePopout, ReferencePositionLayer, TransitionGroup } from '@discord/modules'
import AnimeTransition from '@components/AnimeTransition'
import patchPopoutCSSAnimator from '@/patches/BasePopout/patchPopoutCSSAnimator'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import { autoPosition } from '@/hooks/useAutoPosition'
import { flushSync } from 'react-dom'
import { useRef } from 'react'
import findInReactTree from '@/utils/findInReactTree'
import { MainWindowOnly } from '@/hooks/useWindow'
import { ErrorBoundary } from '@error/boundary'
import AnimationStore from '@animation/store'
import Modules from '@/modules/Modules'

function shouldShow (self, props = self.props, state = self.state) {
  return state.__isSafe !== false && (!state.isLoading || state.shouldShowLoadingState) && self.shouldShowPopout(props, state)
}

function PopoutLayer ({ ref, children, ...props }) {
  const layerRef = useRef()

  const layer = findInReactTree(children, m => m?.type === ReferencePositionLayer)
  if (layer) layer.props.ref = value => {
    layerRef.current = value
    if (props.in) ref.current = value
  }

  return (
    <AnimeTransition
      layerRef={layerRef}
      {...props}
    >
      {children}
    </AnimeTransition>
  )
}

function patchBasePopout () {
  injectModule(BasePopout, ModuleKey.Popouts)

  Patcher.after(ModuleKey.Popouts, BasePopout.prototype, 'componentDidMount', self => {
    self.__unwatchStore = AnimationStore.watch((_, isSafe) => {
      if (self.state.__isSafe !== isSafe) self.setState({ __isSafe: isSafe })
    })
  })
  Patcher.after(ModuleKey.Popouts, BasePopout.prototype, 'componentWillUnmount', self => {
    self.__unwatchStore?.()
  })

  Patcher.after(ModuleKey.Popouts, BasePopout.prototype, 'componentDidUpdate', (self, [props, state]) => {
    // Guarantee up-to-date position before the animation executes
    // because `ResizeObserver` implemented by `BasePopout` may trigger its callback after `requestAnimationFrame`
    // and there will be no way to catch it without waiting for the next frame
    if (shouldShow(self, props, state) !== shouldShow(self) || state.isLoading !== self.state.isLoading)
      requestAnimationFrame(() => {
        flushSync(() => self.setState({ resizeKey: self.state.resizeKey + 1 }))
      })
  })

  Patcher.after(ModuleKey.Popouts, BasePopout.prototype, 'renderLayer', (self, args, value) => {
    const module = Modules.getModule(ModuleKey.Popouts)
    if (!module.isEnabled()) return

    return (
      <ErrorBoundary module={module} fallback={value}>
        <MainWindowOnly fallback={value}>
          {() => {
            const { autoRef, setPosition } = autoPosition(
              self,
              self.props.position,
              { align: self.props.align }
            )

            const position = self.state.renderedPosition ?? self.props.position
            if (autoRef.current.position !== position) setPosition(position)

            return (
              <TransitionGroup component={null}>
                {
                  value && shouldShow(self) &&
                  <PopoutLayer
                    key={+self.state.isLoading}
                    ref={self.layerRef}
                    module={module}
                    autoRef={autoRef}
                    anchor={self.domElementRef}
                  >
                    {value}
                  </PopoutLayer>
                }
              </TransitionGroup>
            )
          }}
        </MainWindowOnly>
      </ErrorBoundary>
    )
  })

  patchPopoutCSSAnimator()
}

export default patchBasePopout
