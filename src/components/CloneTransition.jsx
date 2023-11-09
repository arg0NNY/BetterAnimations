import { React, ReactDOM } from '@/BdApi'
import { Transition } from '@/modules/DiscordModules'
import HTMLNode from '@/components/HTMLNode'
import { getScrolls } from '@/helpers/scrollers'

function normalizeAnimation (animation, options, type) {
  if (typeof animation === 'object')
    return node => node.animate(
      animation,
      Object.assign(options, type === 'exit' ? { fill: 'forwards' } : {})
    )

  return animation
}

class CloneTransition extends React.Component {
  doneCallback = React.createRef()
  animation = React.createRef()
  clonedNode = React.createRef()
  scrolls = React.createRef()

  render () {
    const { animate, children, options, ...props } = this.props

    animate.enter = normalizeAnimation(animate.enter, options, 'enter')
    animate.exit = normalizeAnimation(animate.exit, options, 'exit')

    const onAnimate = (type) => (node, ...args) => {
      if (node || this.clonedNode.current) {
        this.animation.current?.cancel?.()
        this.animation.current = animate[type](this.clonedNode.current ?? node, ...args)
        this.animation.current.finished
          .then(() => this.doneCallback.current?.())
          .catch(() => {})
          .finally(() => this.animation.current = null)
      }

      if (type === 'enter') props.onEntering?.(node, ...args)
      else if (type === 'exit') props.onExiting?.(node, ...args)
    }

    if (props.in === false) {
      const node = ReactDOM.findDOMNode(this)
      if (node) {
        this.clonedNode.current = node.cloneNode(true)
        this.scrolls.current = getScrolls(node)
      }
    }
    const onExited = (...args) => {
      this.clonedNode.current = null
      this.scrolls.current = null
      props.onExited?.(...args)
    }

    return (
      <Transition
        {...props}
        mountOnEnter
        unmountOnExit
        onEntering={onAnimate('enter')}
        onExiting={onAnimate('exit')}
        onExited={onExited}
        addEndListener={(_, done) => this.doneCallback.current = done}
      >
        {state => {
          if (['exiting', 'exited'].includes(state) && this.clonedNode.current)
            return <HTMLNode ref={this.clonedNode} scrolls={this.scrolls.current} />

          return React.Children.only(children)
        }}
      </Transition>
    )
  }
}

export default CloneTransition
