import { React, ReactDOM } from '@/BdApi'
import { Transition } from '@/modules/DiscordModules'
import HTMLNode from '@/components/HTMLNode'
import { getScrolls } from '@/helpers/scrollers'
import { buildAnimateAssets } from '@/modules/Animation/parser'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

// TODO: Allow animation authors to restrict their animations to certain modules (so that their animation can be only enabled for channel switching and nothing else, for example)
// TODO: Prompt users to enable hardware acceleration

class AnimeTransition extends React.Component {
  doneCallback = React.createRef()
  clonedNode = React.createRef()
  scrolls = React.createRef()

  _cancelAnimation = React.createRef()
  get cancelAnimation () {
    return this.props.cancelAnimation?.current ?? this._cancelAnimation.current
  }
  set cancelAnimation (value) {
    if (this.props.cancelAnimation) this.props.cancelAnimation.current = value
    else this._cancelAnimation.current = value
  }

  getTargetNode (node) {
    node = this.clonedNode.current ?? node
    return this.props.targetNode?.(node) ?? node
  }

  onAnimate (type) {
    return (node, ...args) => {
      this.cancelAnimation?.()
      node = this.getTargetNode(node)

      if (node) {
        try {
          const { animations = {}, options = {}, unmountOnExit = true } = this.props

          const animationData = animations[type]
          const animation = animationData?.animation ?? {}

          const assets = buildAnimateAssets(
            animation[type] ?? animation.animate,
            Object.assign(
              {},
              animationData.settings ?? {},
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
    const { animations, children, clone = false, mountOnEnter = true, unmountOnExit = true, enter = true, exit = true, ...props } = this.props

    if (clone && props.in === false) {
      const node = ReactDOM.findDOMNode(this)
      if (node) {
        this.clonedNode.current = node.cloneNode(true)
        this.scrolls.current = getScrolls(node)
      }
    }

    return (
      <Transition
        {...props}
        enter={!!animations?.enter?.animation && enter}
        exit={!!animations?.exit?.animation && exit}
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
        onEntering={this.onAnimate('enter')}
        onExiting={this.onAnimate('exit')}
        onEntered={(node, ...args) => props.onEntered?.(this.getTargetNode(node), ...args)}
        onExited={(node, ...args) => props.onExited?.(this.getTargetNode(node), ...args)}
        addEndListener={(_, done) => this.doneCallback.current = done}
      >
        {state => {
          if (['exiting', 'exited'].includes(state) && this.clonedNode.current)
            return <HTMLNode ref={this.clonedNode} scrolls={this.scrolls.current} />

          return children && React.Children.only(children)
        }}
      </Transition>
    )
  }
}

export default AnimeTransition
