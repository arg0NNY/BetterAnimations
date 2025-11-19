import Patcher from '@/modules/Patcher'
import ModuleKey from '@enums/ModuleKey'
import { Mana, SpringTransitionPhases } from '@discord/modules'
import findInReactTree from '@/utils/findInReactTree'
import { useRef } from 'react'
import AnimeTransition from '@components/AnimeTransition'
import useAutoPosition from '@/hooks/useAutoPosition'
import useWindow from '@/hooks/useWindow'
import useModule from '@/hooks/useModule'
import { useSafeBoolean } from '@/hooks/useAnimationStore'
import { ErrorBoundary, moduleErrorBoundary } from '@error/boundary'

function TooltipTransition ({ module, shouldShow, onExitComplete, onAnimationRest, ...props }) {
  const value = Mana.TooltipLayer({
    ...props,
    isVisible: true,
    isRendered: true
  })

  const layer = findInReactTree(value, m => m?.props?.position)
  if (!layer) throw new Error('Unable to find ReferencePositionLayer')

  const layerRef = useRef()
  const { autoRef, setPosition } = useAutoPosition(null)
  const safeShouldShow = useSafeBoolean(shouldShow)

  Object.assign(layer.props, {
    ref: layerRef,
    onPositionChange: setPosition
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
      layerRef={layerRef}
      module={module}
      autoRef={autoRef}
      anchor={layer.props.targetRef}
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
        <ErrorBoundary module={module} fallback={value}>
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
