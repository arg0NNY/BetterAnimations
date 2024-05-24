import { React } from '@/BdApi'
import { Transition } from '@/modules/DiscordModules'
import { buildAnimateAssets } from '@/modules/animation/parser'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { Freeze } from 'react-freeze'
import AnimationType from '@/enums/AnimationType'
import { css } from '@/modules/Style'

export function AnimeContainer ({ container, children }) {
  if (!container) return children

  return (
    <div data-animation-container="" {...container}>{children}</div>
  )
}

class AnimeTransition extends React.Component {
  doneCallback = React.createRef()

  _cancelAnimation = React.createRef()
  get cancelAnimation () {
    return this.props.cancelAnimation?.current ?? this._cancelAnimation.current
  }
  set cancelAnimation (value) {
    if (this.props.cancelAnimation) this.props.cancelAnimation.current = value
    else this._cancelAnimation.current = value
  }

  getTargetNodes (container) {
    if (container && this.props.targetContainer) {
      container = this.props.targetContainer(container)
      container?.setAttribute('data-animation-container', '')
    }

    return {
      container: container,
      node: container?.getAttribute('data-animation-container') === ''
        ? container.lastElementChild // First one may be [data-animation]
        : container
    }
  }

  onAnimate (type) {
    return (targetNode, ...args) => {
      this.cancelAnimation?.()
      const { container, node } = this.getTargetNodes(targetNode)

      if (node) {
        node.style.display = '' // Removes the 'display: none !important' that is added by Suspense in Freeze

        const { module, auto, unmountOnExit = true } = this.props

        const { animate, context } = module.getAnimation(
          type,
          auto ? { auto } : {},
          { container, element: node }
        )

        const assets = buildAnimateAssets(animate, context, module.buildOptions())

        if (assets.node) node.before(assets.node)

        requestAnimationFrame(() => {
          const { finished, pause, onBeforeDestroy, onDestroyed } = assets.execute()

          container.setAttribute('data-animation-type', type)
          if (module.type) container.setAttribute(`data-animation-${module.type}`, '')

          this.cancelAnimation = () => {
            pause()
            onBeforeDestroy?.()

            this.finish(() => {
              assets.node?.remove()
              onDestroyed?.()
            })

            if (module.type !== 'switch' || type !== AnimationType.Exit || !unmountOnExit)
              [].filter.call(container.attributes, a => a.name !== 'data-animation-container' && a.name?.startsWith('data-animation'))
                .forEach(a => container.removeAttribute(a.name))

            this.cancelAnimation = null
            // console.log('finished', type)
          }

          finished
            .then(() => {})
            .catch(e => console.error(`Error during '${type}' animation execution:`, e))
            .finally(this.cancelAnimation.bind(this))
        })
      }

      if (type === AnimationType.Enter) this.props.onEntering?.(node, ...args)
      else if (type === AnimationType.Exit) this.props.onExiting?.(node, ...args)
    }
  }

  finish (callback = () => {}, immediate = false) {
    const done = () => {
      this.doneCallback.current?.()
      setTimeout(() => callback())
    }
    if (immediate) setTimeout(done.bind(this))
    else done()
  }

  render () {
    const {
      children,
      container = false,
      freeze = false,
      mountOnEnter = true,
      unmountOnExit = true,
      ...props
    } = this.props

    return (
      <Transition
        {...props}
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
        onEntering={this.onAnimate(AnimationType.Enter)}
        onExiting={this.onAnimate(AnimationType.Exit)}
        onEntered={(node, ...args) => props.onEntered?.(this.getTargetNodes(node).node, ...args)}
        onExited={(node, ...args) => props.onExited?.(this.getTargetNodes(node).node, ...args)}
        addEndListener={(_, done) => this.doneCallback.current = done}
      >
        <AnimeContainer container={children && container}>
          <Freeze freeze={freeze && props.in === false}>
            {children && React.Children.only(children)}
          </Freeze>
        </AnimeContainer>
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

[data-animation-container][data-animation-switch] { /* Temporary while overflow is not a setting */
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
