import IconButton from '@/modules/settingsRefresh/components/IconButton'
import AnimationToggleControl from '@/modules/settingsRefresh/components/AnimationToggleControl'
import { css } from '@/modules/Style'
import { stop } from '@/modules/settingsRefresh/helpers/stopPropagation'
import SettingsIcon from '@/modules/settingsRefresh/components/icons/SettingsIcon'
import CollapseListIcon from '@/modules/settingsRefresh/components/icons/CollapseListIcon'
import ErrorManager from '@/modules/ErrorManager'
import { colors } from '@/modules/DiscordModules'
import CircleWarningIcon from '@/modules/settingsRefresh/components/icons/CircleWarningIcon'

function AnimationCardControls ({
  hasSettings,
  hasModifiers,
  expanded,
  setExpanded,
  enter,
  exit,
  setEnter,
  setExit,
  errors = []
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
          <SettingsIcon size="xs" color="currentColor" />
        </IconButton>
        {hasModifiers && (
          <IconButton
            tooltip="Smooth expand/collapse"
            active={expanded === 'modifiers'}
            onClick={stop(() => setExpanded('modifiers'))}
          >
            <CollapseListIcon size="xs" color="currentColor" />
          </IconButton>
        )}
        {!!errors.length && (
          <IconButton
            tooltip="An error occurred"
            onClick={stop(() => ErrorManager.showModal(errors))}
          >
            <CircleWarningIcon size="xs" color={colors.STATUS_DANGER} />
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
    min-height: 28px;
}

.BA__animationCardControlsGroup {
    display: flex;
    gap: 8px;
}`
`AnimationCardControls`
