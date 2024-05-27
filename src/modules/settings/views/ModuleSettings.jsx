import { Router, Common } from '@/modules/DiscordModules'
import AnimationSelect from '@/modules/settings/components/AnimationSelect'
import ModuleContext from '@/modules/settings/context/ModuleContext'
import Emitter from '@/modules/Emitter'
import Events from '@/enums/Events'
import useModule from '@/hooks/useModule'
import ModuleGeneralSettings from '@/modules/settings/components/ModuleGeneralSettings'
import Modules from '@/modules/Modules'
import ModuleList from '@/modules/settings/components/ModuleList'
import { DiscordClasses } from '@/modules/DiscordSelectors'

export default function ModuleSettings () {
  const { id } = Router.useParams()
  const module = useModule(id, true)
  const parent = Modules.getParentModule(module)
  const children = Modules.getChildModules(module)

  const onChange = () => Emitter.emit(Events.ModuleSettingsChanged, id)

  const onSelect = (type, pack, animation) => {
    if (!animation) module.setAnimation(type, null, null)
    else module.setAnimation(type, pack.slug, animation.key, {})
    onChange()
  }
  const setIsEnabled = value => {
    module.setIsEnabled(value)
    Emitter.emit(Events.ModuleToggled, id, value)
  }
  const setGeneralSettings = value => {
    module.setGeneralSettings(value)
    onChange()
  }

  return (
    <ModuleContext.Provider value={module} key={module.id}>
      {parent && (
        <Router.Link to={`/modules/${parent.id}`}>
          <Common.Button
            className={DiscordClasses.Margins.marginBottom8}
            size={Common.ButtonSizes.SMALL}
          >{`Back to ${parent.name}`}</Common.Button>
        </Router.Link>
      )}

      <Common.FormTitle tag="h2">{module.name} Animation</Common.FormTitle>
      {children.length > 0 && (
        <ModuleList items={children} />
      )}
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
          <ModuleGeneralSettings
            module={module}
            onChange={onChange}
          />
        </div>
      )}
    </ModuleContext.Provider>
  )
}
