import { Transition } from '@discord/modules'
import Freeze from '@components/Freeze'
import AnimationType from '@enums/AnimationType'
import { css } from '@style'
import AnimationStore from '@animation/store'
import { createAwaitableRef } from '@utils/react'
import AnimeContainer from '@components/AnimeContainer'
import { Component, createContext, createRef } from 'react'
import { directChild } from '@utils/transition'
import mouse from '@shared/mouse'

const getRef = ref => typeof ref === 'function' ? ref() : ref.current
const injectContainerRefFn = (children, ref) => {
  if (children?.props) children.props.ref = ref
}

export const AnimeTransitionContext = createContext({
  instance: createRef(),
  nodeRef: createRef(),
  state: null
})

class AnimeTransition extends Component {
  constructor (props) {
    super(props)

    this.doneCallback = createAwaitableRef()
    this.containerRef = createRef()
    this.instance = createRef()

    const self = this
    this.nodeRef = {
      get current () {
        if (self.props.containerRef) return getRef(self.props.containerRef)
        if (self.props.layerRef) return getRef(self.props.layerRef)?.elementRef.current
        return self.containerRef.current
      }
    }
  }

  get mouse () {
    return this.props.mouse ?? mouse
  }
  get store () {
    return this.props.store ?? AnimationStore
  }

  componentWillUnmount () {
    this.instance.current?.cancel()
  }

  onAnimate (type, fn) {
    return () => {
      const container = this.nodeRef.current
      container?.setAttribute('data-ba-container', '')
      if (this.props.defaultLayoutStyles === false) container?.setAttribute('data-ba-default-layout-styles', 'false')

      this.instance.current = this.store.requestAnimation({
        module: this.props.module,
        data: this.props.data?.[type],
        type,
        container,
        element: directChild(container),
        viewport: this.props.viewportRef?.current,
        window: window,
        mouse: this.mouse,
        anchor: this.props.anchor,
        auto: this.props.autoRef ?? { current: this.props.auto },
        doneCallbackRef: this.doneCallback
      })

      fn?.()
    }
  }

  onCallback (fn) {
    return () => {
      this.instance.current?.callback?.()
      fn?.()
    }
  }

  render () {
    const {
      module,
      data,
      children,
      container = false,
      freeze = false,
      mountOnEnter = true,
      unmountOnExit = true,
      enter = true,
      exit = true,
      injectContainerRef = false,
      onEntering,
      onExiting,
      onEntered,
      onExited,
      ...props
    } = this.props

    const contents = (state = null) => {
      const _children = typeof children === 'function' ? children(state) : children

      if (injectContainerRef) {
        (
          typeof injectContainerRef === 'function'
            ? injectContainerRef
            : injectContainerRefFn
        )(_children, this.containerRef)
      }

      return (
        <AnimeTransitionContext value={{ instance: this.instance, nodeRef: this.nodeRef, state }}>
          <AnimeContainer container={children && container} ref={this.containerRef}>
            <Freeze freeze={freeze && props.in === false} nodeRef={this.nodeRef}>
              {_children}
            </Freeze>
          </AnimeContainer>
        </AnimeTransitionContext>
      )
    }

    return (
      <Transition
        {...props}
        nodeRef={this.nodeRef}
        enter={(data != null || module.isEnabled(AnimationType.Enter)) && enter}
        exit={(data != null || module.isEnabled(AnimationType.Exit)) && exit}
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
        onEntering={this.onAnimate(AnimationType.Enter, onEntering)}
        onExiting={this.onAnimate(AnimationType.Exit, onExiting)}
        onEntered={this.onCallback(onEntered)}
        onExited={this.onCallback(onExited)}
        addEndListener={done => this.doneCallback.current = done}
      >
        {contents}
      </Transition>
    )
  }
}

export default AnimeTransition

css
`[data-ba-container][data-baa-type], /* Animating Container */
[data-ba-container][data-baa-type] > :not([data-baa]) { /* Animating Element */
    isolation: isolate;
}
[data-ba-container][data-baa-type]:not([data-ba-default-layout-styles="false"]) {
    position: relative;
}

[data-baa] {
    display: contents;
}
[data-baa] > * {
    position: absolute;
}

[data-ba-container][data-baa-overflow="false"] {
    overflow: clip;
}
[data-baa-type="exit"] {
    pointer-events: none;
}

[data-ba-container][data-baa-switch][data-baa-type="exit"] {
    z-index: 1;
}
[data-ba-container][data-baa-switch][data-baa-type="exit"]:not([data-ba-default-layout-styles="false"]) { /* Exiting switch container */
    position: absolute !important;
    inset: 0;
}`
`AnimeTransition`
