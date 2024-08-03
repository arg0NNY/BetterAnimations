import IconButton from '@/modules/settingsRefresh/components/IconButton'
import { Common } from '@/modules/DiscordModules'
import AnimationToggleControl from '@/modules/settingsRefresh/components/AnimationToggleControl'
import { css } from '@/modules/Style'
import { stop } from '@/modules/settingsRefresh/helpers/stopPropagation'

function AnimationCardControls ({
  hasSettings,
  hasModifiers,
  expanded,
  setExpanded,
  enter,
  exit,
  setEnter,
  setExit
}) {
  return (
    <div className="BA__animationCardControls">
      <div className="BA__animationCardControlsGroup">
        <IconButton
          tooltip={hasSettings ? 'Settings' : 'No settings available'}
          disabled={!hasSettings}
          active={expanded === 'settings'}
          onClick={stop(() => setExpanded('settings'))}
        >
          <Common.SettingsIcon size="xs" color="currentColor" />
        </IconButton>
        {hasModifiers && (
          <IconButton
            tooltip="Smooth expand/collapse"
            active={expanded === 'modifiers'}
            onClick={stop(() => setExpanded('modifiers'))}
          >
            <Common.CollapseListIcon size="xs" color="currentColor" />
          </IconButton>
        )}
      </div>
      <AnimationToggleControl
        enter={enter}
        exit={exit}
        setEnter={setEnter}
        setExit={setExit}
      />
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
