import { FormItem, FormSection, FormSwitch, FormText, FormTitle, FormTitleTags, RadioGroup } from '@discord/modules'
import Classes from '@discord/classes'
import useConfig from '@/hooks/useConfig'
import meta from '@/meta'
import SuppressErrors from '@enums/SuppressErrors'
import Divider from '@/components/Divider'
import DurationSlider from '@/settings/components/DurationSlider'
import { configDefaults } from '@data/config'

function GeneralSettings () {
  const [config, onChange] = useConfig()

  return (
    <FormSection
      tag={FormTitleTags.H1}
      title="General Settings"
    >
      <FormSection
        tag={FormTitleTags.H2}
        title="Appearance"
        className={Classes.Margins.marginTop20}
        titleClassName={Classes.Margins.marginBottom8}
      >
        <FormSwitch
          className={Classes.Margins.marginBottom20}
          children="Quick Preview"
          note="Play the animation preview when hovering over an animation card. Disable to play it only when an animation card is expanded."
          value={config.general.quickPreview}
          onChange={value => {
            config.general.quickPreview = value
            onChange()
          }}
        />
        <FormSwitch
          className={Classes.Margins.marginBottom20}
          children="Disable Hints"
          note={`Hide reference links to ${meta.name} documentation in the module settings, animation settings, etc.`}
          value={config.general.disableHints}
          onChange={value => {
            config.general.disableHints = value
            onChange()
          }}
        />
        <FormItem className={Classes.Margins.marginBottom20}>
          <FormTitle className={Classes.Margins.marginBottom8}>
            Suppress Errors
          </FormTitle>
          <FormText className={Classes.Margins.marginBottom20}>
            Disable the toast notification for occurring errors.
            When an error is suppressed, it can only be seen via&nbsp;the&nbsp;Console.
          </FormText>
          <RadioGroup
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
          <Divider className={Classes.Margins.marginTop20} />
        </FormItem>
      </FormSection>
      <FormSection
        tag={FormTitleTags.H2}
        title="Optimizations"
        className={Classes.Margins.marginTop20}
        titleClassName={Classes.Margins.marginBottom8}
      >
        <FormSwitch
          className={Classes.Margins.marginBottom20}
          children="Prioritize Animation Smoothness"
          note="Delay resource-intensive operations until after animations finish to avoid most of the stuttering that occurs while they are running."
          value={config.general.prioritizeAnimationSmoothness}
          onChange={value => {
            config.general.prioritizeAnimationSmoothness = value
            onChange()
          }}
        />
        <FormSwitch
          className={Classes.Margins.marginBottom20}
          children="Cache User Settings Sections"
          note="Significantly improves performance when opening User Settings."
          value={config.general.cacheUserSettingsSections}
          onChange={value => {
            config.general.cacheUserSettingsSections = value
            onChange()
          }}
        />
      </FormSection>
      <FormSection
        tag={FormTitleTags.H2}
        title="Behavior"
        className={Classes.Margins.marginTop20}
        titleClassName={Classes.Margins.marginBottom8}
      >
        <FormItem className={Classes.Margins.marginBottom20}>
          <FormTitle className={Classes.Margins.marginBottom8}>
            Switch Cooldown Duration
          </FormTitle>
          <FormText className={Classes.Margins.marginBottom20}>
            If switch animations overlap, they cancel each other and trigger a cooldown
            preventing new switch animations from playing for a period of time.
          </FormText>
          <DurationSlider
            from={100}
            to={2000}
            defaultValue={configDefaults.general.switchCooldownDuration}
            initialValue={config.general.switchCooldownDuration}
            onValueChange={value => {
              config.general.switchCooldownDuration = value
              onChange()
            }}
          />
        </FormItem>
      </FormSection>
    </FormSection>
  )
}

export default GeneralSettings
