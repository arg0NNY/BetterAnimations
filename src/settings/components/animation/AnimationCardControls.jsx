import IconButton from '@/settings/components/IconButton'
import AnimationToggleControl from '@/settings/components/animation/AnimationToggleControl'
import { css } from '@style'
import { stop } from '@/settings/utils/eventModifiers'
import SettingsIcon from '@/components/icons/SettingsIcon'
import CollapseListIcon from '@/components/icons/CollapseListIcon'
import ErrorManager from '@error/manager'
import { colors } from '@discord/modules'
import CircleWarningIcon from '@/components/icons/CircleWarningIcon'
import { useMovable } from '@/settings/components/animation/AnimationCard'

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
      <div className="BA__animationCardControlsToggle" {...useMovable('toggle')}>
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
    min-height: 36px;
}

.BA__animationCardControlsGroup {
    display: flex;
    gap: 8px;
    padding-left: 10px;
}`
`AnimationCardControls`
