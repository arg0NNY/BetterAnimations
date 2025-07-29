import { use, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { css } from '@style'
import { ChannelSectionStore, Text, useStateFromStores } from '@discord/modules'
import ModuleContext from '@/settings/context/ModuleContext'
import Preview, { PREVIEW_WIDTH } from '@preview'
import Core from '@/modules/Core'
import { moduleEffect } from '@/hooks/useModule'
import classNames from 'classnames'
import { useMovable } from '@/settings/components/animation/AnimationCard'
import useResizeObserver from '@/hooks/useResizeObserver'
import { AnimeTransitionContext } from '@components/AnimeTransition'

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

  const { isMembersOpen: memberListShown = true } = useStateFromStores([ChannelSectionStore], () => ChannelSectionStore.getState())

  return (
    <div
      ref={containerRef}
      className={classNames('BA__animationPreviewContainer', className)}
      {...useMovable('preview')}
    >
      <Preview
        className="BA__animationPreview"
        style={{ scale }}
        key={module.id}
        id={module.id}
        modules={Core.getAllModules(true)}
        placeholder={!isActive}
        pack={pack}
        animation={animation}
        dataKey={dataKey}
        preferences={{ memberListShown }}
      />
      {title && (
        <div className={classNames(
          'BA__animationPreviewTitle',
          { 'BA__animationPreviewTitle--hidden': isActive }
        )}>
          <Text variant="heading-sm/semibold" lineClamp={2} color="always-white">{title}</Text>
        </div>
      )}
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
    transition: border-radius .4s, box-shadow .4s;
}
.BA__animationPreview {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
}
.BA__animationPreviewTitle {
    position: absolute;
    inset: 0;
    padding: 12px;
    background: rgba(0, 0, 0, .1);
    backdrop-filter: blur(15px);
    transition: .4s;
}
.BA__animationPreviewTitle--hidden {
    opacity: 0;
    backdrop-filter: blur(0);
}`
`AnimationPreview`
