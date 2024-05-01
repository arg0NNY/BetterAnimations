import { Patcher } from '@/BdApi'
import { SpringTransitionPhases, Tooltip, TooltipLayer } from '@/modules/DiscordModules'
import AnimeTransition from '@/components/AnimeTransition'
import { tempAnimationData } from '@/patches/ContextMenu/patchContextMenu'
import { directChild } from '@/helpers/transition'

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
    <AnimeTransition
      in={isVisible}
      targetNode={directChild}
      animation={tempAnimationData}
      context={{
        position: props.position,
        // align: props.align,
        duration: 100
      }}
      onEntered={onRest(true)}
      onExited={onRest(false)}
    >
      <TooltipLayer {...rest} />
    </AnimeTransition>
  )
}

function patchTooltip () {
  Patcher.after(Tooltip.prototype, 'renderTooltip', (self, args, value) => {
    value.type = TooltipTransition
  })
}

export default patchTooltip
