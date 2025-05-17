import Patcher from '@/modules/Patcher'
import { SpringTransitionPhases, Tooltip, TooltipLayer } from '@/modules/DiscordModules'
import AnimeTransition from '@/components/AnimeTransition'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import Modules from '@/modules/Modules'
import { useRef } from 'react'
import { MainWindowOnly } from '@/hooks/useWindow'

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

  const auto = {
    position: props.position,
    align: props.align
  }

  const layerRef = useRef()
  const layer = TooltipLayer(rest)
  layer.props.ref = layerRef

  return (
    <AnimeTransition
      in={isVisible}
      layerRef={layerRef}
      module={module}
      auto={auto}
      onEntered={onRest(true)}
      onExited={onRest(false)}
      anchor={props.targetElementRef}
    >
      {layer}
    </AnimeTransition>
  )
}

function patchTooltip () {
  injectModule(Tooltip, ModuleKey.Tooltips)
  Patcher.after(Tooltip.prototype, 'renderTooltip', (self, args, value) => {
    const module = Modules.getModule(ModuleKey.Tooltips)
    if (!module.isEnabled()) return

    return (
      <MainWindowOnly fallback={value}>
        {() => {
          const { text } = self.props
          value.props.children = typeof text === 'function' ? text() : text

          value.props.module = module
          value.type = TooltipTransition

          return value
        }}
      </MainWindowOnly>
    )
  })
}

export default patchTooltip
