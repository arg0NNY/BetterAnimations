import { React, ReactDOM } from '@/BdApi'
import { Transition } from '@/modules/DiscordModules'
import HTMLNode from '@/components/HTMLNode'
import { getScrolls } from '@/helpers/scrollers'
import { buildAnimateAssets } from '@/modules/Animation/parser'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

// TODO: Add some basic math injects
// FIXME: Switching from Nitro to server animates as channel switch
// TODO: Test some broken json for hast, css, and maybe anime
// TODO: Add "anime.random" inject
// TODO: Allow animations to be side-dependent (position, align injects)

// TODO: Allow animation authors to restrict their animations to certain modules (so that their animation can be only enabled for channel switching and nothing else, for example)
// TODO: Prompt users to enable hardware acceleration

class CloneTransition extends React.Component {
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
          const { animation, context } = this.props

          const assets = buildAnimateAssets(
            animation[type] ?? animation.animate,
            Object.assign(
              {
                variant: 'right',
                duration: 600,
                easing: 'easeInOutQuad',
              },
              context ?? {},
              {
                node,
                type,
                settings: animation.settings
              }
            )
          )
          console.log(assets)

          if (assets.node) node.before(assets.node)

          requestAnimationFrame(() => {
            const { finished, pause } = assets.execute()

            node.setAttribute('data-animation-type', type)

            this.cancelAnimation = () => {
              pause()
              this.finish(() => assets.node?.remove())
              node.removeAttribute('data-animation-type')
              this.cancelAnimation = null
              console.log('finished', type)
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
    this.clonedNode.current = null
    this.scrolls.current = null
    const done = () => {
      this.doneCallback.current?.()
      setTimeout(() => callback())
    }
    if (immediate) setTimeout(done.bind(this))
    else done()
  }

  render () {
    const { animation, children, clone = true, ...props } = this.props

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
        mountOnEnter
        unmountOnExit
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

export default CloneTransition
