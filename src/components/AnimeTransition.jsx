import { React } from '@/BdApi'
import { Transition } from '@/modules/DiscordModules'
import { buildAnimateAssets } from '@/modules/animation/parser'
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
  cancel = React.createRef()

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
      const callback = this.cancel.current?.(true)

      const { container, node } = this.getTargetNodes(targetNode)

      if (!node) return requestAnimationFrame(() => this.doneCallback.current?.())

      node.style.display = '' // Removes the 'display: none !important' that is added by Suspense in Freeze

      const { module, auto } = this.props

      const { animate, context } = module.getAnimation(
        type,
        auto ? { auto } : {},
        { container, element: node }
      )

      const assets = buildAnimateAssets(animate, context, module.buildOptions())
      const { onBeforeCreate, onBeforeDestroy, onDestroyed } = assets

      onBeforeCreate?.()

      requestAnimationFrame(() => {
        const { instances, finished, pause } = assets.execute()

        if (callback) {
          callback()
          instances.forEach(i => {
            // Force anime to re-apply styles because cancel callback might have removed some (prevent element flashing on 1 frame)
            const { paused } = i
            i.reset()
            i.paused = paused
          })
        }

        container.setAttribute('data-animation-type', type)
        container.setAttribute('data-animation-overflow', context.overflow)
        if (module.type) container.setAttribute(`data-animation-${module.type}`, '')

        if (assets.wrapper) node.before(assets.wrapper)

        const clear = (cancel = false) => {
          onBeforeDestroy?.()

          pause()
          this.doneCallback.current?.()
          this.cancel.current = null

          const callback = () => {
            assets.wrapper?.remove()

            ;[].filter.call(container.attributes, a => a.name !== 'data-animation-container' && a.name?.startsWith('data-animation'))
              .forEach(a => container.removeAttribute(a.name))

            onDestroyed?.()
          }

          return cancel ? callback : requestAnimationFrame(callback)
        }

        this.cancel.current = clear

        finished
          .then(() => {})
          .catch(e => console.error(`Error during '${type}' animation execution:`, e))
          .finally(() => clear())
      })
    }
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
