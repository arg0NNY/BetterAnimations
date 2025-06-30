import { FormSection, FormSwitch, FormTitleTags } from '@discord/modules'
import Classes from '@discord/classes'
import useConfig from '@/hooks/useConfig'
import meta from '@/meta'

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
          note={`Hide reference links to ${meta.name} documentation in module settings, animation settings, etc.`}
          value={config.general.disableHints}
          onChange={value => {
            config.general.disableHints = value
            onChange()
          }}
        />
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
    </FormSection>
  )
}

export default GeneralSettings
