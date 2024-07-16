import { React } from '@/BdApi'
import { Common } from '@/modules/DiscordModules'
import Modules from '@/modules/Modules'
import PackAccordion from '@/modules/settingsRefresh/components/PackAccordion'
import PackManager from '@/modules/PackManager'
import useModule from '@/hooks/useModule'
import Emitter from '@/modules/Emitter'
import Events from '@/enums/Events'

function ModuleSettings ({ moduleId }) {
  const module = useModule(moduleId, true)
  const parentModules = React.useMemo(() => Modules.getParentModules(module), [module])
  const breadcrumbs = parentModules.concat(module).map(m => ({
    id: m.id,
    label: m.name
  }))

  const onChange = React.useCallback(() => Emitter.emit(Events.ModuleSettingsChanged, module.id), [module.id])

  const onSelect = React.useCallback((type, pack, animation) => {
    if (!animation) module.setAnimation(type, null, null)
    else module.setAnimation(type, pack.slug, animation.key, {})
    onChange()
  }, [module])
  const setIsEnabled = React.useCallback(value => {
    module.setIsEnabled(value)
    Emitter.emit(Events.ModuleToggled, module.id, value)
  }, [module])

  return (
    <div className="BA__moduleSettings">
      <Common.Breadcrumbs
        breadcrumbs={breadcrumbs}
        activeId={module.id}
      />
      <PackAccordion
        module={module}
        packs={PackManager.getAllPacks()}
        selected={module.getAnimations()}
        onSelect={onSelect}
      />
    </div>
  )
}

export default ModuleSettings
