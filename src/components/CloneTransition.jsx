import { React, ReactDOM } from '@/BdApi'
import { Transition } from '@/modules/DiscordModules'
import HTMLNode from '@/components/HTMLNode'
import { getScrolls } from '@/helpers/scrollers'
import { buildAnimateAssets } from '@/modules/Animation/parser'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

// TODO: Add some basic math injects
// FIXME: Switching from Nitro to server animates as channel switch
// FIXME: Process enter and exit animations overlapping
// TODO: Test some broken json for hast, css, and maybe anime

class CloneTransition extends React.Component {
  doneCallback = React.createRef()
  clonedNode = React.createRef()
  scrolls = React.createRef()

  onAnimate (type) {
    return (node, ...args) => {
      node = this.clonedNode.current ?? node

      if (node) {
        try {
          const { animation } = this.props

          const assets = buildAnimateAssets(animation[type] ?? animation.animate, {
            node: this.clonedNode.current ?? node,
            type,
            variant: 'right',
            duration: 600,
            easing: 'easeInOutQuad',
            settings: animation.settings
          })
          console.log(assets)

          if (assets.node) node.before(assets.node)

          requestAnimationFrame(() => {
            assets.execute()
              .then(() => {
                console.log('finished', type)
              })
              .catch(e => console.error(`Failed to execute '${type}' animation:`, e))
              .finally(() => this.finish(() => assets.node?.remove()))
          })
        }
        catch (e) {
          e = e instanceof z.ZodError ? fromZodError(e).message : e
          console.error(`Failed to load '${type}' animation:`, e)
          this.finish()
        }
      }

      if (type === 'enter') this.props.onEntering?.(node, ...args)
      else if (type === 'exit') this.props.onExiting?.(node, ...args)
    }
  }

  finish (callback = () => {}) {
    this.clonedNode.current = null
    this.scrolls.current = null
    setTimeout(() => {
      this.doneCallback.current?.()
      setTimeout(() => callback())
    })
  }

  render () {
    const { animation, children, ...props } = this.props

    if (props.in === false) {
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
