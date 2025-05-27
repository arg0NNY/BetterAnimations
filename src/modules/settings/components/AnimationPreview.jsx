import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { css } from '@style'
import { Text, Timeout } from '@discord/modules'
import ModuleContext from '@/modules/settings/context/ModuleContext'
import Preview, { PREVIEW_WIDTH } from '@preview'
import Modules from '@/modules/Modules'
import { moduleEffect } from '@/hooks/useModule'
import useElementBounding from '@/hooks/useElementBounding'
import classNames from 'classnames'

export function getPreviewHeight (width) {
  return width * 9 / 16
}

function AnimationPreview ({ pack, animation, title = animation?.name, active = false }) {
  const module = useContext(ModuleContext)

  const [isActive, setIsActive] = useState(active)
  const timeout = useMemo(() => new Timeout, [])
  useEffect(() => {
    if (active) timeout.start(500, () => setIsActive(true))
    else {
      timeout.stop()
      setIsActive(false)
    }
  }, [active])

  const [dataKey, setDataKey] = useState(0)
  useEffect(() => moduleEffect(
    module.id,
    () => setDataKey(key => key + 1),
    true
  ), [module])

  const containerRef = useRef()
  const { width } = useElementBounding(containerRef)
  const scale = width / PREVIEW_WIDTH

  return (
    <div ref={containerRef} className="BA__animationPreviewContainer">
      <Preview
        className="BA__animationPreview"
        style={{ scale }}
        key={module.id}
        id={module.id}
        modules={Modules.getAllModules(true)}
        placeholder={!isActive}
        pack={pack}
        animation={animation}
        dataKey={dataKey}
      />
      {title && (
        <div className={classNames(
          'BA__animationPreviewTitle',
          { 'BA__animationPreviewTitle--hidden': isActive }
        )}>
          <Text variant="heading-sm/medium" lineClamp={2} color="always-white">{title}</Text>
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
    padding: 8px;
    background: rgba(255, 255, 255, .05);
    backdrop-filter: blur(15px);
    transition: .4s;
}
.BA__animationPreviewTitle--hidden {
    opacity: 0;
    backdrop-filter: blur(0);
}`
`AnimationPreview`
