import { Patcher } from '@/BdApi'
import { BasePopoutKeyed, TransitionGroup } from '@/modules/DiscordModules'
import AnimeTransition from '@/components/AnimeTransition'
import patchPopoutCSSAnimator from '@/patches/BasePopout/patchPopoutCSSAnimator'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import { autoPosition } from '@/hooks/useAutoPosition'
import { avoidClickTrap } from '@/utils/transition'
import { unkeyed } from '@/utils/webpack'
import { flushSync } from 'react-dom'

function patchBasePopout () {
  const Original = unkeyed(BasePopoutKeyed)

  class AnimatedBasePopout extends Original {
    constructor (...args) {
      super(...args)

      // Prevent preload firing when popout is already open (fixing Discord's bug basically)
      Patcher.instead(this, 'handlePreload', (_, args, original) => !this.shouldShow() && original(...args))
    }

    shouldShow (props = this.props, state = this.state) {
      return this.shouldShowPopout(props, state) && (!state.isLoading || state.shouldShowLoadingState)
    }

    componentDidUpdate (props, state) {
      super.componentDidUpdate(props, state)

      // Guarantee up-to-date position before the animation executes
      // because `ResizeObserver` implemented by `BasePopout` may trigger its callback after `requestAnimationFrame`
      // and there will be no way to catch it without waiting for the next frame
      if (this.shouldShow(props, state) !== this.shouldShow() || state.isLoading !== this.state.isLoading)
        requestAnimationFrame(() => {
          flushSync(() => this.setState({ resizeKey: this.state.resizeKey + 1 }))
        })
    }

    renderLayer (...args) {
      let anchor = this.domElementRef?.current
      if (!anchor) {
        try { anchor = this.getDomElement() }
        catch {}
      }

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
            this.shouldShow() &&
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

  Patcher.instead(...BasePopoutKeyed, (self, [props, ...rest]) => {
    const module = useModule(ModuleKey.Popouts)
    if (!module.isEnabled()) return <Original {...props} />

    return <AnimatedBasePopout {...props} module={module} />
  })
  patchPopoutCSSAnimator()
}

export default patchBasePopout
