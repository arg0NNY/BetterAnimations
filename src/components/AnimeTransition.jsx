import { Transition } from '@/modules/DiscordModules'
import Freeze from '@/components/Freeze'
import AnimationType from '@/enums/AnimationType'
import { css } from '@/modules/Style'
import AnimationStore from '@/modules/AnimationStore'
import { createAwaitableRef } from '@/utils/react'
import AnimeContainer from '@/components/AnimeContainer'
import { Component, createRef } from 'react'

class AnimeTransition extends Component {
  doneCallback = createAwaitableRef()
  containerRef = createRef()
  instance = createRef()

  componentWillUnmount () {
    requestAnimationFrame(this.instance.current?.cancel() ?? (() => {}))
  }

  getTargetNodes (container) {
    if (container && this.props.targetContainer) {
      container = this.props.targetContainer(container)
      container?.setAttribute('data-animation-container', '')
    }

    return {
      container: container,
      node: container?.getAttribute('data-animation-container') === ''
        ? [].find.call(container.childNodes, e => !e.getAttribute('data-animation'))
        : container
    }
  }

  onAnimate (type) {
    return (targetNode) => {
      const { container, node } = this.getTargetNodes(targetNode)

      this.instance.current = AnimationStore.requestAnimation({
        module: this.props.module,
        type,
        container,
        node,
        anchor: this.props.anchor,
        auto: this.props.autoRef ?? { current: this.props.auto },
        doneCallbackRef: this.doneCallback
      })
    }
  }

  render () {
    const {
      module,
      children,
      container = false,
      freeze = false,
      mountOnEnter = true,
      unmountOnExit = true,
      enter = true,
      exit = true,
      containerRef,
      ...props
    } = this.props

    const contents = (state = null) => (
      <AnimeContainer container={children && container} ref={this.containerRef}>
        <Freeze freeze={freeze && props.in === false} nodeRef={containerRef ?? this.containerRef}>
          {typeof children === 'function' ? children(state) : children}
        </Freeze>
      </AnimeContainer>
    )

    return (
      <Transition
        {...props}
        enter={module.isEnabled(AnimationType.Enter) && enter}
        exit={module.isEnabled(AnimationType.Exit) && exit}
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
        onEntering={this.onAnimate(AnimationType.Enter)}
        onExiting={this.onAnimate(AnimationType.Exit)}
        addEndListener={(_, done) => this.doneCallback.current = done}
      >
        {typeof children === 'function' ? contents : contents()}
      </Transition>
    )
  }
}

export default AnimeTransition

css
`[data-animation-container][data-animation-type] { /* Container while animation is running */
    position: relative;
    background: none;
}

[data-animation] > * {
    position: absolute;
}

[data-animation-type="exit"] {
    pointer-events: none;
}

[data-animation-container][data-animation-overflow="false"] {
    overflow: clip;
}
[data-animation-container][data-animation-switch] > :not([data-animation]) { /* Animating switch element */
    contain: layout;
}
[data-animation-container][data-animation-switch][data-animation-type="exit"] { /* Exiting switch container */
    position: absolute !important;
    inset: 0;
}`
`AnimeTransition`
