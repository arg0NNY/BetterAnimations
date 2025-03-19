import { React } from '@/BdApi'
import AnimationSetting from '@/enums/AnimationSetting'
import DurationControl from '@/modules/settingsRefresh/components/controls/DurationControl'
import EasingControl from '@/modules/settingsRefresh/components/controls/EasingControl'
import VariantControl from '@/modules/settingsRefresh/components/controls/VariantControl'
import PositionControl from '@/modules/settingsRefresh/components/controls/PositionControl'
import DirectionControl from '@/modules/settingsRefresh/components/controls/DirectionControl'
import OverflowControl from '@/modules/settingsRefresh/components/controls/OverflowControl'
import { css } from '@/modules/Style'
import { Common } from '@/modules/DiscordModules'
import IconButton from '@/modules/settingsRefresh/components/IconButton'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import RefreshIcon from '@/modules/settingsRefresh/components/icons/RefreshIcon'
import AnimationSettingContainer from '@/enums/AnimationSettingContainer'

function SettingList ({ children, className = 'BA__animationSettingsList' }) {
  return (
    <div className={className}>
      {typeof children === 'function' ? children() : children.map(item => {
        if (!item) return <div></div>
        return <Setting {...item} />
      })}
    </div>
  )
}

function SettingGroup ({ children }) {
  return (
    <SettingList className="BA__animationSettingsGroup">
      {children}
    </SettingList>
  )
}

function Setting ({ type, ...props }) {
  if (type === AnimationSettingContainer.List) return <SettingList {...props} />
  if (type === AnimationSettingContainer.Group) return <SettingGroup {...props} />

  return (
    <div className="BA__animationSettingsItem">
      {React.createElement(
        {
          [AnimationSetting.Duration]: DurationControl,
          [AnimationSetting.Easing]: EasingControl,
          [AnimationSetting.Variant]: VariantControl,
          [AnimationSetting.Position]: PositionControl,
          [AnimationSetting.Direction]: DirectionControl,
          [AnimationSetting.Overflow]: OverflowControl
        }[type],
        props
      )}
    </div>
  )
}

function AnimationSettingsHeader ({ headers }) {
  return (
    <SettingGroup>
      {() => headers.map(({ key, title, subtitle, enabled, setEnabled, onReset, switchTooltip }) => (
        <div className="BA__animationSettingsItem BA__animationSettingsHeader" key={key}>
          <Common.Text variant="heading-lg/semibold">
            {title}
            {subtitle && (
              <Common.Text
                tag="span"
                variant="heading-md/normal"
                color="header-muted"
                className={DiscordClasses.Margins.marginLeft8}
              >{subtitle}</Common.Text>
            )}
          </Common.Text>
          <div className="BA__animationSettingsHeaderControls">
            {onReset && (
              <IconButton tooltip="Reset" onClick={onReset}>
                <RefreshIcon size="xs" color="currentColor" />
              </IconButton>
            )}
            {typeof enabled === 'boolean' && (
              <Common.Tooltip text={switchTooltip} hideOnClick={false}>
                {props => (
                  <div {...props}>
                    <Common.Switch checked={enabled} disabled={!setEnabled} onChange={setEnabled} />
                  </div>
                )}
              </Common.Tooltip>
            )}
          </div>
        </div>
      ))}
    </SettingGroup>
  )
}

function AnimationSettings ({ headers, settings }) {
  return (
    <div className="BA__animationSettings">
      <AnimationSettingsHeader headers={headers} />
      {settings.map(Setting)}
    </div>
  )
}

export default AnimationSettings

css
`.BA__animationSettings {
    position: relative;
    isolation: isolate;
}
.BA__animationSettings::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    border-right: 1px solid var(--background-modifier-accent);
    z-index: -1;
}
.BA__animationSettings, .BA__animationSettingsList {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.BA__animationSettingsGroup {
    display: flex;
    gap: 40px;
}
.BA__animationSettingsGroup > * {
    flex: 1;
}

.BA__animationSettingsItem {
    background-color: var(--background-primary);
    box-shadow: 0 -12px 0 var(--background-primary),
                0 12px 0 var(--background-primary);
}

.BA__animationSettingsHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
}
.BA__animationSettingsHeaderControls {
    display: flex;
    gap: 10px;
    align-items: center;
}`
`AnimationSettings`
