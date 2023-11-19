import { Patcher, ReactDOM } from '@/BdApi'
import { BasePopout, TransitionGroup } from '@/modules/DiscordModules'
import CloneTransition from '@/components/CloneTransition'
import { tempAnimationData } from '@/patches/ContextMenu/patchContextMenu'
import { clearContainingStyles } from '@/helpers/style'
import patchPopoutCSSAnimator from '@/patches/BasePopout/patchPopoutCSSAnimator'
import findInReactTree from '@/helpers/findInReactTree'
import ensureOnce from '@/helpers/ensureOnce'

const once = ensureOnce()

function patchBasePopout () {
  const unbindedOriginal = BasePopout.prototype.renderLayer
  const shouldShow = self => self.shouldShowPopout(self.props, self.state) && (!self.state.isLoading || self.state.shouldShowLoadingState)

  Patcher.instead(BasePopout.prototype, 'renderLayer', (self, args) => {
    // Prevent preload firing when popout is already open (fixing Discord's bug basically)
    once(
      () => Patcher.instead(self, 'handlePreload', (_, args, original) => !shouldShow(self) && original(...args)),
      self
    )

    const value = unbindedOriginal.call(
      Object.assign(
        {}, self,
        {
          shouldShowPopout: () => true,
          domElementRef: { current: self.domElementRef.current ?? ReactDOM.findDOMNode(self) },
          state: Object.assign({}, self.state, { shouldShowLoadingState: true })
        }
      ),
      args
    )

    // console.log(self, args, value)

    const referencePositionLayer = findInReactTree(value, m => m?.type?.prototype?.calculatePositionStyle)
    if (referencePositionLayer)
      Patcher.instead(referencePositionLayer.props, 'children', (_, args, original) => {
        try {
          return (
            <TransitionGroup component={null}>
              <CloneTransition
                appear
                key={+self.state.isLoading}
                clone={false}
                exit={false}
                animation={tempAnimationData}
                onEntered={clearContainingStyles}
              >
                {original(...args)}
              </CloneTransition>
            </TransitionGroup>
          )
        }
        catch (e) {}
      })

    return (
      <CloneTransition
        in={shouldShow(self)}
        clone={false}
        enter={false}
        animation={tempAnimationData}
      >
        {value}
      </CloneTransition>
    )
  })

  patchPopoutCSSAnimator()
}

export default patchBasePopout
