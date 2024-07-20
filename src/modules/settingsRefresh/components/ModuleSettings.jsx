import { React } from '@/BdApi'
import { Common } from '@/modules/DiscordModules'
import Modules from '@/modules/Modules'
import PackAccordion from '@/modules/settingsRefresh/components/PackAccordion'
import PackManager from '@/modules/PackManager'
import useModule from '@/hooks/useModule'
import { css } from '@/modules/Style'

function ModuleSettings ({ moduleId, refToScroller }) {
  const module = useModule(moduleId, true)
  const parentModules = React.useMemo(() => Modules.getParentModules(module), [module])
  const breadcrumbs = parentModules.concat(module).map(m => ({
    id: m.id,
    label: m.name
  }))

  const onSelect = React.useCallback((type, pack, animation) => {
    if (!animation) module.setAnimation(type, null, null)
    else module.setAnimation(type, pack.slug, animation.key, {})
  }, [module])
  const setIsEnabled = React.useCallback(value => module.setIsEnabled(value), [module])

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
        refToScroller={refToScroller}
      />
      <div style={{ height: '1000px' }} />
    </div>
  )
}

export default ModuleSettings

css
`.BA__moduleSettings {
    transition: transform .4s;
}`
`ModuleSettings`
