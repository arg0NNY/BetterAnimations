import { FormSection, FormSwitch, FormTitleTags } from '@discord/modules'
import Classes from '@discord/classes'
import useConfig from '@/hooks/useConfig'

function GeneralSettings () {
  const [config, onChange] = useConfig()

  return (
    <FormSection
      tag={FormTitleTags.H1}
      title="General Settings"
    >
      <FormSection
        tag={FormTitleTags.H2}
        title="Optimizations"
        className={Classes.Margins.marginTop20}
        titleClassName={Classes.Margins.marginBottom8}
      >
        <FormSwitch
          className={Classes.Margins.marginBottom20}
          children="Prioritize animation smoothness"
          note="Delay resource-intensive operations until after animations finish to avoid most of the stuttering that occurs while they are running."
          value={config.general.prioritizeAnimationSmoothness}
          onChange={value => {
            config.general.prioritizeAnimationSmoothness = value
            onChange()
          }}
        />
        <FormSwitch
          className={Classes.Margins.marginBottom20}
          children="Cache User Settings sections"
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
