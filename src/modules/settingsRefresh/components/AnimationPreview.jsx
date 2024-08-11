import { css } from '@/modules/Style'
import { Common } from '@/modules/DiscordModules'

function AnimationPreview ({ title, active = false }) {
  return (
    <div className="BA__animationPreview">
      {title && (
        <div className="BA__animationPreviewTitle">
          <Common.Text variant="heading-sm/normal" lineClamp={2}>{title}</Common.Text>
        </div>
      )}
    </div>
  )
}

export default AnimationPreview

css
`.BA__animationPreview {
    position: relative;
    overflow: hidden;
    aspect-ratio: 16 / 9;
    border-radius: 8px;
    background: var(--background-accent);
}

.BA__animationPreviewTitle {
    position: absolute;
    inset: 0;
    padding: 8px;
    background: rgba(0, 0, 0, .5);
    transition: opacity .2s;
}`
`AnimationPreview`
