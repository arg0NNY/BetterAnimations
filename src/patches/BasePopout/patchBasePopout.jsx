import Patcher from '@/modules/Patcher'
import { BasePopoutKeyed, ReferencePositionLayer, TransitionGroup } from '@discord/modules'
import AnimeTransition from '@components/AnimeTransition'
import patchPopoutCSSAnimator from '@/patches/BasePopout/patchPopoutCSSAnimator'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import { autoPosition } from '@/hooks/useAutoPosition'
import { unkeyed } from '@/utils/webpack'
import { flushSync } from 'react-dom'
import { useRef } from 'react'
import findInReactTree from '@/utils/findInReactTree'
import useWindow from '@/hooks/useWindow'
import { ErrorBoundary } from '@error/boundary'
import AnimationStore from '@animation/store'

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
  const Original = unkeyed(BasePopoutKeyed)

  class AnimatedBasePopout extends Original {
    componentDidMount () {
      super.componentDidMount()
      this.__unwatchStore = AnimationStore.watch((_, isSafe) => {
        if (this.state.__isSafe !== isSafe) this.setState({ __isSafe: isSafe })
      })
    }
    componentWillUnmount () {
      super.componentWillUnmount()
      this.__unwatchStore?.()
    }

    shouldShow (props = this.props, state = this.state) {
      return state.__isSafe !== false && (!state.isLoading || state.shouldShowLoadingState) && this.shouldShowPopout(props, state)
    }

    componentDidUpdate (props, state) {
      super.componentDidUpdate(props, state)

      // Guarantee up-to-date position before the animation executes
      // because `ResizeObserver` implemented by `BasePopout` may trigger its callback after `requestAnimationFrame`
      // and there will be no way to catch it without waiting for the next frame
      if (this.shouldShow(props, state) !== this.shouldShow() || state.isLoading !== this.state.isLoading)
        requestAnimationFrame(() => {
          flushSync(() => this.setState({ resizeKey: this.state.resizeKey + 1 }))
        })
    }

    renderLayer (...args) {
      const value = super.renderLayer.call(
        Object.assign(
          {}, this,
          {
            shouldShowPopout: () => true,
            state: Object.assign({}, this.state, { shouldShowLoadingState: true })
          }
        ),
        args
      )

      const { autoRef, setPosition } = autoPosition(
        this,
        this.props.position,
        { align: this.props.align }
      )

      const position = this.state.renderedPosition ?? this.props.position
      if (autoRef.current.position !== position) setPosition(position)

      return (
        <TransitionGroup component={null}>
          {
            this.shouldShow() &&
            <PopoutLayer
              key={+this.state.isLoading}
              ref={this.layerRef}
              module={this.props.module}
              autoRef={autoRef}
              anchor={this.domElementRef}
            >
              {value}
            </PopoutLayer>
          }
        </TransitionGroup>
      )
    }
  }

  const fallback = (self, [props]) => <Original {...props} />

  Patcher.instead(ModuleKey.Popouts, ...BasePopoutKeyed, (self, [props]) => {
    const fallback = <Original {...props} />
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Popouts)
    if (!isMainWindow || !module.isEnabled()) return fallback

    return (
      <ErrorBoundary module={module} fallback={fallback}>
        <AnimatedBasePopout {...props} module={module} />
      </ErrorBoundary>
    )
  }, { fallback })
  patchPopoutCSSAnimator()
}

export default patchBasePopout
