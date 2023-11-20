import { Patcher } from '@/BdApi'
import { SpringTransitionPhases, Tooltip, TooltipLayer } from '@/modules/DiscordModules'
import CloneTransition from '@/components/CloneTransition'
import { tempAnimationData } from '@/patches/ContextMenu/patchContextMenu'

function TooltipTransition (props) {
  const { isVisible, onAnimationRest, ...rest } = props

  const onRest = isVisible => () => onAnimationRest?.(
    { value: {}, finished: true },
    {
      ctrl: {},
      expired: !isVisible,
      item: isVisible,
      key: isVisible ? 'tooltip' : 'empty',
      phase: isVisible ? SpringTransitionPhases.ENTER : SpringTransitionPhases.LEAVE
    }
  )

  return (
    <CloneTransition
      in={isVisible}
      clone={false}
      animation={tempAnimationData}
      onEntered={onRest(true)}
      onExited={onRest(false)}
    >
      <TooltipLayer {...rest} />
    </CloneTransition>
  )
}

function patchTooltip () {
  Patcher.after(Tooltip.prototype, 'renderTooltip', (self, args, value) => {
    value.type = TooltipTransition
    // self.props.onAnimationRest = (...args) => console.log('rest', args)
  })
}

export default patchTooltip
