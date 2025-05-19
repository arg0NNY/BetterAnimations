import { Text } from '@/modules/DiscordModules'
import PackAccordion from '@/modules/settings/components/PackAccordion'
import PackManager from '@/modules/PackManager'
import useModule from '@/hooks/useModule'
import { css } from '@style'
import ModuleSettingsHeader from '@/modules/settings/components/ModuleSettingsHeader'
import ModuleContext from '@/modules/settings/context/ModuleContext'
import { useCallback } from 'react'
import { PREINSTALLED_PACK_SLUG } from '@packs'
import AnimationList from '@/modules/settings/components/AnimationList'
import NoPacksPlaceholder from '@/modules/settings/components/NoPacksPlaceholder'

function ModuleSettings ({ moduleId, refToScroller }) {
  const module = useModule(moduleId, true)

  const onSelect = useCallback((type, pack, animation) => {
    if (!animation) module.setAnimation(type, null, null)
    else module.setAnimation(type, pack.slug, animation.key, {})
  }, [module])
  const setIsEnabled = useCallback(value => module.setIsEnabled(value), [module])

  const selected = module.getAnimations()

  const preinstalledPack = PackManager.getPack(PREINSTALLED_PACK_SLUG)
  const preinstalledAnimations = preinstalledPack?.animations.filter(a => module.isSupportedBy(a)) ?? []

  const packs = PackManager.getAllPacks(true)
    .filter(p => p.partial || p.animations.some(a => module.isSupportedBy(a)))

  return (
    <ModuleContext.Provider value={module}>
      <div key={moduleId} className="BA__moduleSettings">
        <ModuleSettingsHeader
          module={module}
          enabled={module.isEnabled()}
          setEnabled={setIsEnabled}
          selected={selected}
          onSelect={onSelect}
          refToScroller={refToScroller}
        />

        {preinstalledAnimations.length ? (
          <>
            <Text variant="heading-sm/semibold" className="BA__moduleSettingsSectionTitle">
              <span>ANIMATIONS</span>
            </Text>
            <AnimationList
              module={module}
              pack={preinstalledPack}
              animations={preinstalledAnimations}
              selected={selected}
              onSelect={onSelect}
              refToScroller={refToScroller}
            />
          </>
        ) : null}

        <Text variant="heading-sm/semibold" className="BA__moduleSettingsSectionTitle">
          <span>PACKS</span>
        </Text>
        {!!packs.length ? (
          <PackAccordion
            module={module}
            packs={packs}
            selected={selected}
            onSelect={onSelect}
            refToScroller={refToScroller}
          />
        ) : (
          <NoPacksPlaceholder />
        )}
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
