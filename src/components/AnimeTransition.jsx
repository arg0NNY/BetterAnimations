import { React } from '@/BdApi'
import { Transition } from '@/modules/DiscordModules'
import { buildAnimateAssets } from '@/modules/Animation/parser'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { Freeze } from 'react-freeze'

// TODO: Allow animation authors to restrict their animations to certain modules (so that their animation can be only enabled for channel switching and nothing else, for example)
// TODO: Prompt users to enable hardware acceleration

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

  getTargetNode (node) {
    return this.props.targetNode?.(node) ?? node
  }

  onAnimate (type) {
    return (node, ...args) => {
      this.cancelAnimation?.()
      node = this.getTargetNode(node)
      if (node) node.style.display = '' // Removes the 'display: none !important' that is added by Suspense in Freeze

      if (node) {
        try {
          const { animations = {}, options = {}, unmountOnExit = true } = this.props

          const animationData = animations[type]
          const animation = animationData?.animation ?? {}

          const assets = buildAnimateAssets(
            animation[type] ?? animation.animate,
            Object.assign(
              {},
              animationData?.settings ?? {},
              {
                node,
                type,
                settings: animation.settings
              }
            ),
            options
          )
          // console.log(assets)

          if (assets.node) node.before(assets.node)

          requestAnimationFrame(() => {
            const styleSnapshot = node.getAttribute('style')
            const { finished, pause } = assets.execute()

            node.setAttribute('data-animation-type', type)
            if (options.type) node.setAttribute(`data-animation-${options.type}`, '')

            this.cancelAnimation = () => {
              pause()
              this.finish(() => {
                assets.node?.remove()
                if (type === 'exit') node.setAttribute('style', styleSnapshot)
              })

              if (options.type !== 'switch' || type !== 'exit' || !unmountOnExit)
                [].filter.call(node.attributes, a => a.name?.startsWith('data-animation'))
                  .forEach(a => node.removeAttribute(a.name))

              this.cancelAnimation = null
              // console.log('finished', type)
            }

            finished
              .then(() => {})
              .catch(e => console.error(`Failed to execute '${type}' animation:`, e))
              .finally(this.cancelAnimation.bind(this))
          })
        }
        catch (e) {
          e = e instanceof z.ZodError ? fromZodError(e).message : e
          console.error(`Failed to load '${type}' animation:`, e)
          this.finish(() => {}, true)
        }
      }

      if (type === 'enter') this.props.onEntering?.(node, ...args)
      else if (type === 'exit') this.props.onExiting?.(node, ...args)
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
    const { animations, options = {}, children, freeze = false, mountOnEnter = true, unmountOnExit = true, enter = true, exit = true, ...props } = this.props

    return (
      <Transition
        {...props}
        enter={(!!animations?.enter?.animation || options.before) && enter}
        exit={(!!animations?.exit?.animation || options.after) && exit}
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
        onEntering={this.onAnimate('enter')}
        onExiting={this.onAnimate('exit')}
        onEntered={(node, ...args) => props.onEntered?.(this.getTargetNode(node), ...args)}
        onExited={(node, ...args) => props.onExited?.(this.getTargetNode(node), ...args)}
        addEndListener={(_, done) => this.doneCallback.current = done}
      >
        <Freeze freeze={freeze && props.in === false}>
          {children && React.Children.only(children)}
        </Freeze>
      </Transition>
    )
  }
}

export default AnimeTransition
