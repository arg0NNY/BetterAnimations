import { React } from '@/BdApi'
import { Common } from '@/modules/DiscordModules'
import PackAccordion from '@/modules/settingsRefresh/components/PackAccordion'
import PackManager from '@/modules/PackManager'
import useModule from '@/hooks/useModule'
import { css } from '@/modules/Style'
import ModuleSettingsHeader from '@/modules/settingsRefresh/components/ModuleSettingsHeader'
import ModuleContext from '@/modules/settingsRefresh/context/ModuleContext'

function ModuleSettings ({ moduleId, refToScroller }) {
  const module = useModule(moduleId, true)

  const onSelect = React.useCallback((type, pack, animation) => {
    if (!animation) module.setAnimation(type, null, null)
    else module.setAnimation(type, pack.slug, animation.key, {})
  }, [module])
  const setIsEnabled = React.useCallback(value => module.setIsEnabled(value), [module])

  const selected = module.getAnimations()

  const packs = PackManager.getAllPacks()

  return (
    <ModuleContext.Provider value={module}>
      <div className="BA__moduleSettings">
        <ModuleSettingsHeader
          module={module}
          enabled={module.isEnabled()}
          setEnabled={setIsEnabled}
          selected={selected}
          onSelect={onSelect}
          refToScroller={refToScroller}
        />

        <Common.Text variant="heading-sm/semibold" className="BA__moduleSettingsSectionTitle">
          <span>ANIMATIONS</span>
        </Common.Text>
        <Common.Text>*Preinstalled animations*</Common.Text>

        {packs.length ? (
          <>
            <Common.Text variant="heading-sm/semibold" className="BA__moduleSettingsSectionTitle">
              <span>PACKS</span>
            </Common.Text>
            <PackAccordion
              module={module}
              packs={packs}
              selected={selected}
              onSelect={onSelect}
              refToScroller={refToScroller}
            />
          </>
        ) : null}
      </div>
    </ModuleContext.Provider>
  )
}

export default ModuleSettings

css
`.BA__moduleSettings {
    transition: transform .4s;
}

.BA__moduleSettingsSectionTitle {
    margin-top: 32px;
    margin-bottom: 16px;
    color: var(--header-secondary);
    text-align: center;
    position: relative;
}
.BA__moduleSettingsSectionTitle::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: currentColor;
    opacity: .2;
}
.BA__moduleSettingsSectionTitle > span {
    position: relative;
    background: var(--background-primary);
    padding: 0 8px;
}`
`ModuleSettings`
