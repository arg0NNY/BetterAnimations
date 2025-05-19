import { css } from '@style'
import { Text } from '@/modules/DiscordModules'
import ModuleContext from '@/modules/settings/context/ModuleContext'
import { useContext } from 'react'
import WIP from '@/modules/settings/components/WIP'

export function getPreviewHeight (width) {
  return width * 9 / 16
}

function AnimationPreview ({ title, active = false, wide = false }) {
  const module = useContext(ModuleContext)

  return (
    <div className="BA__animationPreviewContainer">
      {wide && (
        <WIP
          name="Animation Preview"
          size={WIP.Sizes.Medium}
          color="text-normal"
        />
      )}
      {title && (
        <div className="BA__animationPreviewTitle">
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
    aspect-ratio: 16 / 9;
    border-radius: 8px;
    background: var(--background-base-low);
    display: flex;
    align-items: center;
}

.BA__animationPreviewTitle {
    position: absolute;
    inset: 0;
    padding: 8px;
    background: rgba(0, 0, 0, .5);
    transition: opacity .2s;
}`
`AnimationPreview`
