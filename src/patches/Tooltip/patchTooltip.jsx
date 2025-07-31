import Patcher from '@/modules/Patcher'
import { SpringTransitionPhases, Tooltip, TooltipLayer } from '@discord/modules'
import AnimeTransition from '@components/AnimeTransition'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import Core from '@/modules/Core'
import { useRef } from 'react'
import { MainWindowOnly } from '@/hooks/useWindow'
import { ErrorBoundary } from '@error/boundary'
import { useSafeBoolean } from '@/hooks/useAnimationStore'

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

  const safeIsVisible = useSafeBoolean(isVisible)

  return (
    <AnimeTransition
      in={safeIsVisible}
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
  Tooltip.defaultProps.delay = 0
  injectModule(Tooltip, ModuleKey.Tooltips)
  Patcher.after(ModuleKey.Tooltips, Tooltip.prototype, 'renderTooltip', (self, args, value) => {
    const module = Core.getModule(ModuleKey.Tooltips)
    if (!module.isEnabled()) return

    const { text } = self.props

    return (
      <ErrorBoundary module={module} fallback={value}>
        <MainWindowOnly fallback={value}>
          {() => (
            <TooltipTransition
              {...value.props}
              children={typeof text === 'function' ? text() : text}
              module={module}
            />
          )}
        </MainWindowOnly>
      </ErrorBoundary>
    )
  })
}

export default patchTooltip
