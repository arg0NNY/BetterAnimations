import IconButton from '@/settings/components/IconButton'
import AnimationToggleControl from '@/settings/components/AnimationToggleControl'
import { css } from '@style'
import { stop } from '@/settings/utils/eventModifiers'
import SettingsIcon from '@/settings/components/icons/SettingsIcon'
import CollapseListIcon from '@/settings/components/icons/CollapseListIcon'
import ErrorManager from '@error/manager'
import { colors } from '@discord/modules'
import CircleWarningIcon from '@/settings/components/icons/CircleWarningIcon'
import { useMovable } from '@/settings/components/AnimationCard'

function AnimationCardControls ({
  hasSettings,
  hasAccordions,
  expanded,
  setExpanded,
  enter,
  exit,
  setEnter,
  setExit,
  errors = [],
  forceOpenSettingsTooltip = false
}) {
  return (
    <div className="BA__animationCardControls">
      <div className="BA__animationCardControlsGroup" {...useMovable('controls')}>
        <IconButton
          tooltip={{
            text: hasSettings ? 'Settings' : 'No settings available',
            forceOpen: forceOpenSettingsTooltip
          }}
          disabled={!hasSettings}
          active={expanded === 'settings'}
          onClick={stop(() => setExpanded('settings'))}
        >
          <SettingsIcon size="xs" color="currentColor" />
        </IconButton>
        {hasAccordions && (
          <IconButton
            tooltip="Smooth Expand/Collapse"
            active={expanded === 'accordions'}
            onClick={stop(() => setExpanded('accordions'))}
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
      <div class="BA__animationCardControlsToggle" {...useMovable('toggle')}>
        <AnimationToggleControl
          enter={enter}
          exit={exit}
          setEnter={setEnter}
          setExit={setExit}
        />
      </div>
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
