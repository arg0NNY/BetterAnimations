import { use, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { css } from '@style'
import { ChannelSectionStore, colors, getThemeClass, Text, useStateFromStores } from '@discord/modules'
import ModuleContext from '@/settings/context/ModuleContext'
import Preview, { PREVIEW_WIDTH } from '@preview'
import Core from '@/modules/Core'
import { moduleEffect } from '@/hooks/useModule'
import classNames from 'classnames'
import { useMovable } from '@/settings/components/animation/AnimationCard'
import useResizeObserver from '@/hooks/useResizeObserver'
import { AnimeTransitionContext } from '@components/AnimeTransition'
import Logger from '@logger'
import IconButton from '@/settings/components/IconButton'
import EyeIcon from '@/components/icons/EyeIcon'
import RefreshIcon from '@/components/icons/RefreshIcon'
import { stop } from '@/settings/utils/eventModifiers'
import ErrorManager from '@error/manager'
import CircleWarningIcon from '@/components/icons/CircleWarningIcon'

export function getPreviewHeight (width) {
  return width * 9 / 16
}

function AnimationPreview ({
  module = use(ModuleContext),
  pack,
  animation,
  title = animation?.name,
  active = false,
  className
}) {
  const { isActive: hasActiveAnimation } = use(AnimeTransitionContext)
  const isActive = active && !hasActiveAnimation

  const [dataKey, setDataKey] = useState(0)
  useEffect(() => moduleEffect(
    module.id,
    () => setDataKey(key => key + 1),
    true
  ), [module])

  const containerRef = useRef()
  const [scale, setScale] = useState(1)
  const onUpdate = useCallback(() => {
    setScale(containerRef.current.offsetWidth / PREVIEW_WIDTH)
  }, [setScale])
  useResizeObserver(containerRef, onUpdate)
  useLayoutEffect(onUpdate, [])

  const [error, setError] = useState(null)
  useEffect(() => {
    if (!isActive) setError(null)
  }, [isActive])
  const onError = useCallback(error => {
    setError(error)
    Logger.error('AnimationPreview', error)
  }, [setError])

  const { isMembersOpen: memberListShown = true } = useStateFromStores([ChannelSectionStore], () => ChannelSectionStore.getState())

  const modules = useMemo(() => Core.getAllModules(true), [])
  const style = useMemo(() => ({ scale }), [scale])
  const preferences = useMemo(() => ({ memberListShown }), [memberListShown])

  return (
    <div
      ref={containerRef}
      className={classNames('BA__animationPreviewContainer', className)}
      {...useMovable('preview')}
    >
      <Preview
        className={classNames(
          getThemeClass('darker'),
          'BA__animationPreview'
        )}
        style={style}
        key={module.id}
        id={module.id}
        modules={modules}
        placeholder={!isActive || error != null}
        pack={pack}
        animation={animation}
        dataKey={dataKey}
        preferences={preferences}
        onError={onError}
      />
      <div className={classNames(
        'BA__animationPreviewOverlay',
        { 'BA__animationPreviewOverlay--hidden': (isActive || !title) && !error }
      )}>
        {error ? (
          <div className="BA__animationPreviewError">
            <CircleWarningIcon size="lg" color={colors.STATUS_DANGER} />
            <Text variant="text-sm/bold">An error occurred.</Text>
            <div className="BA__animationPreviewErrorActions">
              <IconButton
                tooltip="View"
                onClick={stop(() => ErrorManager.showModal([error]))}
              >
                <EyeIcon size="sm" color="currentColor" />
              </IconButton>
              <IconButton
                tooltip="Try again"
                onClick={stop(() => setError(null))}
              >
                <RefreshIcon size="xs" color="currentColor" />
              </IconButton>
            </div>
          </div>
        ) : title ? (
          <Text variant="heading-sm/semibold" lineClamp={2} color="always-white">{title}</Text>
        ) : null}
      </div>
    </div>
  )
}

export default AnimationPreview

css
`.BA__animationPreviewContainer {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    aspect-ratio: 16 / 9;
    border-radius: 4px;
    background: var(--background-base-low);
    display: flex;
    align-items: center;
    box-shadow: 0 0 0 1px var(--border-faint);
    transition: border-radius .4s, box-shadow .4s, transform .4s;
}
.BA__animationPreview {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
}
.BA__animationPreview::after {
    content: '';
    position: absolute;
    inset: 0;
    box-shadow: inset 0 0 80px 0 rgba(0,0,0,.5);
    z-index: 10;
}
.BA__animationPreviewOverlay {
    position: absolute;
    inset: 0;
    padding: 12px;
    background: rgba(0, 0, 0, .1);
    backdrop-filter: blur(15px);
    transition: .4s;
    display: flex;
    flex-direction: column;
}
.BA__animationPreviewOverlay--hidden {
    opacity: 0;
    backdrop-filter: blur(0);
}
.BA__animationPreviewError {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
    text-align: center;
}
.BA__animationPreviewErrorActions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
}`
`AnimationPreview`
