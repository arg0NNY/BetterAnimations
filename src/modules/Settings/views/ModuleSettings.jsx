import { Router, Common } from '@/modules/DiscordModules'
import AnimationSelect from '@/modules/Settings/components/AnimationSelect'
import ModuleContext from '@/modules/Settings/context/ModuleContext'
import Emitter from '@/modules/Emitter'
import Events from '@/enums/Events'
import useModule from '@/hooks/useModule'

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
  const setSettings = (type, value) => {
    module.setAnimationSettings(type, value)
    onChange()
  }

  return (
    <ModuleContext.Provider value={module}>
      <Common.FormTitle tag="h2">{module.name} Animation</Common.FormTitle>
      <Common.FormSwitch value={module.isEnabled()} onChange={setIsEnabled}>Enabled</Common.FormSwitch>
      {module.isEnabled() && (
        <AnimationSelect
          module={module}
          selected={module.getAnimations()}
          onSelect={onSelect}
          setSettings={setSettings}
        />
      )}
    </ModuleContext.Provider>
  )
}
