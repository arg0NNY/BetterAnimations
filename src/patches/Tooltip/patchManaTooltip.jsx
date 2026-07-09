import Patcher, { TinyPatcher } from '@/modules/Patcher'
import ModuleKey from '@enums/ModuleKey'
import { Mana, SpringTransitionPhases } from '@discord/modules'
import findInReactTree from '@/utils/findInReactTree'
import { useId } from 'react'
import AnimeTransition from '@components/AnimeTransition'
import useAutoPosition from '@/hooks/useAutoPosition'
import useWindow from '@/hooks/useWindow'
import useModule from '@/hooks/useModule'
import { useSafeBoolean } from '@/hooks/useAnimationStore'
import { ErrorBoundary, moduleErrorBoundary } from '@error/boundary'

// TODO: Use AnimeFloating
function TooltipTransition ({ module, shouldShow, onExitComplete, onAnimationRest, ...props }) {
  const value = Mana.TooltipLayer({
    ...props,
    isVisible: true,
    isRendered: true
  })

  const layer = findInReactTree(value, m => m?.props?.placement)
  if (!layer) throw new Error('Unable to find FloatingLayer')

  const id = useId()
  layer.props.id = id
  const containerRef = () => document.getElementById(id)

  const { autoRef, setPosition } = useAutoPosition(props.position, { align: props.align })
  const safeShouldShow = useSafeBoolean(shouldShow)

  TinyPatcher.before(ModuleKey.Tooltips, layer.props, 'renderLayer', (self, [{ placement }]) => {
    setPosition(placement.split('-')[0])
  })

  const onRest = isVisible => () => {
    if (!isVisible) onExitComplete?.()
    onAnimationRest?.(
      { value: {}, finished: true },
      {
        ctrl: {},
        expired: !isVisible,
        item: isVisible,
        key: isVisible ? 'tooltip' : 'empty',
        phase: isVisible ? SpringTransitionPhases.ENTER : SpringTransitionPhases.LEAVE
      }
    )
  }

  return (
    <AnimeTransition
      in={safeShouldShow}
      containerRef={containerRef}
      module={module}
      autoRef={autoRef}
      anchor={props.targetElement ?? props.targetElementRef}
      onEntered={onRest(true)}
      onExited={onRest(false)}
    >
      {value}
    </AnimeTransition>
  )
}

function patchUseTooltipTransition () {
  Patcher.instead(ModuleKey.Tooltips, ...Mana.useTooltipTransitionKeyed, (self, [options], original) => {
    const { shouldShow, onExitComplete, onAnimationRest } = options

    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Tooltips)
    if (!isMainWindow || !module.isEnabled()) return original(options)

    original({ ...options, shouldShow: false }) // Prevent hook mismatches on the module toggle

    return moduleErrorBoundary(ModuleKey.Tooltips, render => {
      const value = render({}, true)

      const tooltipLayer = findInReactTree(value, m => m?.props?.position)
      if (!tooltipLayer) throw new Error('Unable to find TooltipLayer')

      Object.assign(tooltipLayer, (
        <ErrorBoundary module={module} fallback={render({}, shouldShow)}>
          <TooltipTransition
            {...tooltipLayer.props}
            module={module}
            shouldShow={shouldShow}
            onExitComplete={onExitComplete}
            onAnimationRest={onAnimationRest}
          />
        </ErrorBoundary>
      ))

      return value
    }, render => render({}, shouldShow))
  })
}

function patchManaTooltip () {
  patchUseTooltipTransition()
}

export default patchManaTooltip
