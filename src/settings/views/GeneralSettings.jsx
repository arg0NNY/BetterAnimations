import {
  Switch,
  RadioGroup,
  Text,
  FieldSet
} from '@discord/modules'
import useConfig from '@/hooks/useConfig'
import meta from '@/meta'
import SuppressErrors from '@enums/SuppressErrors'
import Divider from '@/components/Divider'
import DurationSlider from '@/settings/components/DurationSlider'
import { configDefaults } from '@data/config'
import Messages from '@shared/messages'
import { MigratorContainer } from '@/components/Migrator'
import Config from '@/modules/Config'
import { css } from '@style'

function GeneralSettings () {
  const { config, onChange } = useConfig()

  return (
    <MigratorContainer migrator={Config.migrator}>
      <div className="BA__generalSettings">
        <Text
          variant="heading-xl/semibold"
          color="text-strong"
        >
          General Settings
        </Text>
        <FieldSet label="Appearance">
          <Switch
            label="Quick Preview"
            description="Play the animation preview when hovering over an animation card. Disable to play it only when an animation card is expanded."
            checked={config.general.quickPreview}
            onChange={value => {
              config.general.quickPreview = value
              onChange()
            }}
          />
          <Switch
            label="Disable Hints"
            description={`Hide reference links to ${meta.name} documentation in the module settings, animation settings, etc.`}
            checked={config.general.disableHints}
            onChange={value => {
              config.general.disableHints = value
              onChange()
            }}
          />
          <RadioGroup
            label="Suppress Errors"
            description={(
              <>
                Disable the toast notification for occurring errors.
                When an error is suppressed, it can only be seen via&nbsp;the&nbsp;Console.
              </>
            )}
            options={[
              { value: SuppressErrors.All, name: 'Suppress all errors' },
              { value: SuppressErrors.Animation, name: 'Suppress animation errors' },
              { value: SuppressErrors.None, name: 'Do not suppress errors' },
            ]}
            value={config.general.suppressErrors}
            onChange={({ value }) => {
              config.general.suppressErrors = value
              onChange()
            }}
          />
        </FieldSet>
        <Divider />
        <FieldSet label="Optimizations">
          <Switch
            label={Messages.PRIORITIZE_ANIMATION_SMOOTHNESS}
            description="Delay resource-intensive operations until after animations finish to avoid most of the stuttering that occurs while they are running."
            checked={config.general.prioritizeAnimationSmoothness}
            onChange={value => {
              config.general.prioritizeAnimationSmoothness = value
              onChange()
            }}
          />
          <Switch
            label="Preload Layers"
            description="Load full-screen pages (Legacy User Settings, Server Settings, Channel Settings, etc.) in advance to prevent them from interrupting the animations when opened."
            checked={config.general.preloadLayers}
            onChange={value => {
              config.general.preloadLayers = value
              onChange()
            }}
          />
          <Switch
            label={Messages.CACHE_USER_SETTINGS_SECTIONS}
            description="Significantly improves performance when opening Legacy User Settings."
            checked={config.general.cacheUserSettingsSections}
            onChange={value => {
              config.general.cacheUserSettingsSections = value
              onChange()
            }}
          />
        </FieldSet>
        <Divider />
        <FieldSet label="Behavior">
          <DurationSlider
            label="Switch Cooldown Duration"
            description={(
              <>
                Disable the toast notification for occurring errors.
                When an error is suppressed, it can only be seen via&nbsp;the&nbsp;Console.
              </>
            )}
            from={100}
            to={2000}
            defaultValue={configDefaults.general.switchCooldownDuration}
            initialValue={config.general.switchCooldownDuration}
            onValueChange={value => {
              config.general.switchCooldownDuration = value
              onChange()
            }}
          />
        </FieldSet>
      </div>
    </MigratorContainer>
  )
}

export default GeneralSettings

css
`.BA__generalSettings {
    display: flex;
    flex-direction: column;
    gap: 32px;
}`
`GeneralSettings`
