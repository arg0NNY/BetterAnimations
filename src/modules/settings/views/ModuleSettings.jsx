import { Router, Common } from '@/modules/DiscordModules'
import AnimationSelect from '@/modules/settings/components/AnimationSelect'
import ModuleContext from '@/modules/settings/context/ModuleContext'
import Emitter from '@/modules/Emitter'
import Events from '@/enums/Events'
import useModule from '@/hooks/useModule'
import ModuleGeneralSettingsLegacy from '@/modules/settings/components/ModuleGeneralSettingsLegacy'
import ModuleGeneralSettings from '@/modules/settings/components/ModuleGeneralSettings'

export default function ModuleSettings () {
  const { id } = Router.useParams()
  const module = useModule(id)

  const onChange = () => Emitter.emit(Events.ModuleSettingsChanged, id)

  const onSelect = (type, pack, animation) => {
    if (!animation) module.setAnimation(type, null, null)
    else module.setAnimation(type, pack.slug, animation.key, {})
    onChange()
  }
  const setIsEnabled = value => {
    module.setIsEnabled(value)
    onChange()
  }
  const setGeneralSettings = value => {
    module.setGeneralSettings(value)
    onChange()
  }

  return (
    <ModuleContext.Provider value={module}>
      <Common.FormTitle tag="h2">{module.name} Animation</Common.FormTitle>
      <Common.FormSwitch value={module.isEnabled()} onChange={setIsEnabled}>Enabled</Common.FormSwitch>
      {module.isEnabled() && (
        <div>
          {module.meta.disableCustomAnimations || (
            <AnimationSelect
              module={module}
              selected={module.getAnimations()}
              onSelect={onSelect}
              onChange={onChange}
            />
          )}
          <ModuleGeneralSettingsLegacy
            module={module}
            settings={module.getGeneralSettings()}
            onChange={setGeneralSettings}
          />
          <ModuleGeneralSettings
            module={module}
            onChange={onChange}
          />
        </div>
      )}
    </ModuleContext.Provider>
  )
}
