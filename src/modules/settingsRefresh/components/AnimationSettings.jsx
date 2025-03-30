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
import AnimationSettingContainer from '@/enums/AnimationSettingContainer'
import { createElement } from 'react'
import { Utils } from '@/BdApi'
import RedoIcon from '@/modules/settingsRefresh/components/icons/RedoIcon'

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

function SettingGroup ({ children, className }) {
  return (
    <SettingList className={Utils.className('BA__animationSettingsGroup', className)}>
      {children}
    </SettingList>
  )
}

function Setting ({ type, ...props }) {
  if (type === AnimationSettingContainer.List) return <SettingList {...props} />
  if (type === AnimationSettingContainer.Group) return <SettingGroup {...props} />

  return (
    <div className="BA__animationSettingsItem">
      {createElement(
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
    <SettingGroup className="BA__animationSettingsHeaderGroup">
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
              <IconButton tooltip="Reset all" onClick={onReset}>
                <RedoIcon size="sm" color="currentColor" />
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
.BA__animationSettings::before,
.BA__animationSettingsHeaderGroup::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    border-right: 1px solid var(--border-subtle);
    z-index: -1;
}
.BA__animationSettings, .BA__animationSettingsList {
    display: flex;
    flex-direction: column;
    gap: 16px;
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
    box-shadow: 0 -16px 0 var(--background-primary),
                0 16px 0 var(--background-primary);
}

.BA__animationSettingsHeaderGroup {
    position: sticky;
    top: 0;
    z-index: 100;
    isolation: isolate;
}
.BA__animationSettingsHeaderGroup::before {
    top: -20px;
    bottom: -16px;
}
.BA__animationSettingsHeaderGroup::after {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -16px;
    background-color: var(--background-primary);
    z-index: -2;
}
.BA__animationSettingsHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 4px;
    box-shadow: 0 -20px 0 var(--background-primary),
                0 16px 0 var(--background-primary);
}
.BA__animationSettingsHeaderControls {
    display: flex;
    gap: 10px;
    align-items: center;
}`
`AnimationSettings`
