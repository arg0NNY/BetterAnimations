import { Patcher, React, ReactDOM } from '@/BdApi'
import { BasePopout, mangled, TransitionGroup } from '@/modules/DiscordModules'
import AnimeTransition from '@/components/AnimeTransition'
import patchPopoutCSSAnimator from '@/patches/BasePopout/patchPopoutCSSAnimator'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import { autoPosition } from '@/hooks/useAutoPosition'
import { avoidClickTrap } from '@/helpers/transition'

function patchBasePopout () {
  const Original = mangled(BasePopout)

  class AnimatedBasePopout extends Original {
    constructor (...args) {
      super(...args)

      // Prevent preload firing when popout is already open (fixing Discord's bug basically)
      Patcher.instead(this, 'handlePreload', (_, args, original) => !this.shouldShow(this) && original(...args))
    }

    shouldShow () {
      return this.shouldShowPopout(this.props, this.state) && (!this.state.isLoading || this.state.shouldShowLoadingState)
    }

    renderLayer (...args) {
      const anchor = this.domElementRef?.current ?? ReactDOM.findDOMNode(this)

      const value = super.renderLayer.call(
        Object.assign(
          {}, this,
          {
            shouldShowPopout: () => true,
            domElementRef: { current: anchor },
            state: Object.assign({}, this.state, { shouldShowLoadingState: true })
          }
        ),
        args
      )

      const { autoRef, setPosition } = autoPosition(
        this,
        this.props.position,
        { align: this.props.align }
      )

      const position = this.state.renderedPosition ?? this.props.position
      if (autoRef.current.position !== position) setPosition(position)

      return (
        <TransitionGroup component={null}>
          {
            this.shouldShow(this) &&
            <AnimeTransition
              key={+this.state.isLoading}
              targetContainer={avoidClickTrap}
              module={this.props.module}
              autoRef={autoRef}
              anchor={anchor}
            >
              {value}
            </AnimeTransition>
          }
        </TransitionGroup>
      )
    }
  }

  Patcher.instead(...BasePopout, (self, [props, ...rest]) => {
    const module = useModule(ModuleKey.Popouts)
    if (!module.isEnabled()) return <Original {...props} />

    return <AnimatedBasePopout {...props} module={module} />
  })
  patchPopoutCSSAnimator()
}

export default patchBasePopout
