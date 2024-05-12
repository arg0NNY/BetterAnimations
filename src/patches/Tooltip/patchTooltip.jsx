import { Patcher } from '@/BdApi'
import { SpringTransitionPhases, Tooltip, TooltipLayer } from '@/modules/DiscordModules'
import AnimeTransition from '@/components/AnimeTransition'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import Modules from '@/modules/Modules'

function TooltipTransition (props) {
  const { module, isVisible, onAnimationRest, ...rest } = props

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

  const animations = module.getAnimations({
    auto: {
      position: props.position,
      align: props.align
    }
  })

  return (
    <AnimeTransition
      in={isVisible}
      targetContainer={e => e}
      animations={animations}
      onEntered={onRest(true)}
      onExited={onRest(false)}
    >
      <TooltipLayer {...rest} />
    </AnimeTransition>
  )
}

function patchTooltip () {
  injectModule(Tooltip, ModuleKey.Tooltips)
  Patcher.after(Tooltip.prototype, 'renderTooltip', (self, args, value) => {
    const module = Modules.getModule(ModuleKey.Tooltips)
    if (!module.isEnabled()) return

    value.props.module = module
    value.type = TooltipTransition
  })
}

export default patchTooltip
