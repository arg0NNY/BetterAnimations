import { Patcher, React, ReactDOM } from '@/BdApi'
import { BasePopoutModule, TransitionGroup } from '@/modules/DiscordModules'
import CloneTransition from '@/components/CloneTransition'
import { tempAnimationData } from '@/patches/ContextMenu/patchContextMenu'
import { clearContainingStyles, directChild } from '@/helpers/transition'
import patchPopoutCSSAnimator from '@/patches/BasePopout/patchPopoutCSSAnimator'

class AnimatedBasePopout extends BasePopoutModule.BasePopout {
  constructor (...args) {
    super(...args)

    // Prevent preload firing when popout is already open (fixing Discord's bug basically)
    Patcher.instead(this, 'handlePreload', (_, args, original) => !this.shouldShow(this) && original(...args))
  }

  shouldShow () {
    return this.shouldShowPopout(this.props, this.state) && (!this.state.isLoading || this.state.shouldShowLoadingState)
  }

  renderLayer (...args) {
    const value = super.renderLayer.call(
      Object.assign(
        {}, this,
        {
          shouldShowPopout: () => true,
          domElementRef: { current: this.domElementRef.current ?? ReactDOM.findDOMNode(this) },
          state: Object.assign({}, this.state, { shouldShowLoadingState: true })
        }
      ),
      args
    )

    return (
      <TransitionGroup component={null}>
        {
          this.shouldShow(this) &&
          <CloneTransition
            key={+this.state.isLoading}
            clone={false}
            targetNode={directChild}
            animation={tempAnimationData}
            context={{
              duration: 200
            }}
            onEntered={clearContainingStyles}
          >
            {value}
          </CloneTransition>
        }
      </TransitionGroup>
    )
  }
}

function patchBasePopout () {
  Patcher.instead(BasePopoutModule, 'BasePopout', (self, [props]) => <AnimatedBasePopout {...props} />)
  patchPopoutCSSAnimator()
}

export default patchBasePopout
