import { Router, Common } from '@/modules/DiscordModules'
import Modules from '@/modules/Modules'
import AnimationSelect from '@/modules/Settings/components/AnimationSelect'
import useForceUpdate from '@/hooks/useForceUpdate'
import ModuleContext from '@/modules/Settings/context/ModuleContext'

export default function ModuleSettings () {
  const forceUpdate = useForceUpdate()
  const { id } = Router.useParams()

  const module = Modules.getModule(id)

  const onSelect = (type, pack, animation) => {
    if (!animation) module.setAnimation(type, null, null)
    else module.setAnimation(type, pack.slug, animation.key, {})
    forceUpdate()
  }
  const setIsEnabled = value => {
    module.setIsEnabled(value)
    forceUpdate()
  }
  const setSettings = (type, value) => {
    module.setAnimationSettings(type, value)
    forceUpdate()
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
