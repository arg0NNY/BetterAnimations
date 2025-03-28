import { css } from '@/modules/Style'
import { Common } from '@/modules/DiscordModules'
import ModuleContext from '@/modules/settingsRefresh/context/ModuleContext'
import useRafFn from '@/hooks/useRafFn'
import { useContext, useMemo, useRef, useState } from 'react'

export function getPreviewHeight (width) {
  return width * 9 / 16
}

function AnimationPreview ({ title, active = false }) {
  const containerRef = useRef()
  const previewRef = useRef()

  const module = useContext(ModuleContext)

  const PreviewComponent = useMemo(() => {
    switch (module.id) {
      default: return () => null
    }
  }, [module.id])

  const [scale, setScale] = useState(1)
  useRafFn(() => {
    if (!containerRef.current || !previewRef.current) return

    const targetScale = containerRef.current.clientWidth / previewRef.current.clientWidth
    if (Math.abs(scale - targetScale) > .0001) setScale(targetScale)
  })

  return (
    <div ref={containerRef} className="BA__animationPreviewContainer">
      <PreviewComponent
        ref={previewRef}
        className="BA__animationPreview"
        style={{ scale: scale.toFixed(4) }}
      />
      {title && (
        <div className="BA__animationPreviewTitle">
          <Common.Text variant="heading-sm/medium" lineClamp={2} color="always-white">{title}</Common.Text>
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
    aspect-ratio: 16 / 9;
    border-radius: 8px;
    background: var(--background-base-low);
}

.BA__animationPreviewTitle {
    position: absolute;
    inset: 0;
    padding: 8px;
    background: rgba(0, 0, 0, .5);
    transition: opacity .2s;
}

.BA__animationPreview {
    isolation: isolate;
    overflow: hidden !important;
    position: absolute !important;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    
    --text-primary: #3B3D42;
    --text-heading: #505357;
}`
`AnimationPreview`
