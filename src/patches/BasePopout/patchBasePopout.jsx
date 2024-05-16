import { Patcher, React, ReactDOM } from '@/BdApi'
import { BasePopoutModule, TransitionGroup } from '@/modules/DiscordModules'
import AnimeTransition from '@/components/AnimeTransition'
import patchPopoutCSSAnimator from '@/patches/BasePopout/patchPopoutCSSAnimator'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'

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

    const animations = this.props.module.getAnimations({
      auto: {
        position: this.props.position,
        align: this.props.align
      }
    })

    return (
      <TransitionGroup component={null}>
        {
          this.shouldShow(this) &&
          <AnimeTransition
            key={+this.state.isLoading}
            targetContainer={e => e}
            module={this.props.module}
            animations={animations}
          >
            {value}
          </AnimeTransition>
        }
      </TransitionGroup>
    )
  }
}

function patchBasePopout () {
  const Original = BasePopoutModule.BasePopout
  Patcher.instead(BasePopoutModule, 'BasePopout', (self, [props, ...rest]) => {
    const module = useModule(ModuleKey.Popouts)
    if (!module.isEnabled()) return <Original {...props} />

    return <AnimatedBasePopout {...props} module={module} />
  })
  patchPopoutCSSAnimator()
}

export default patchBasePopout
