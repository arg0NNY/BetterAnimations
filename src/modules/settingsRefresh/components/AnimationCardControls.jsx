import IconButton from '@/modules/settingsRefresh/components/IconButton'
import { Common } from '@/modules/DiscordModules'
import AnimationToggleControl from '@/modules/settingsRefresh/components/AnimationToggleControl'
import { css } from '@/modules/Style'
import { stop } from '@/modules/settingsRefresh/helpers/stopPropagation'

function AnimationCardControls ({ animation, ...props }) {
  return (
    <div className="BA__animationCardControls">
      <div className="BA__animationCardControlsGroup">
        {animation.settings && (
          <IconButton tooltip="Settings" onClick={stop()}>
            <Common.SettingsIcon size="xs" color="currentColor" />
          </IconButton>
        )}
        <IconButton tooltip="Smooth expand/collapse" onClick={stop()}>
          <Common.CollapseListIcon size="xs" color="currentColor" />
        </IconButton>
      </div>
      <AnimationToggleControl {...props} />
    </div>
  )
}

export default AnimationCardControls

css
`.BA__animationCardControls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
}

.BA__animationCardControlsGroup {
    display: flex;
    gap: 8px;
}`
`AnimationCardControls`
