import { Paginator, Text } from '@discord/modules'
import PackManager from '@/modules/PackManager'
import useModule from '@/hooks/useModule'
import { css } from '@style'
import ModuleSettingsHeader from '@/settings/components/ModuleSettingsHeader'
import ModuleContext from '@/settings/context/ModuleContext'
import { useCallback, useEffect, useState } from 'react'
import { PREINSTALLED_PACK_SLUG } from '@packs'
import AnimationList from '@/settings/components/animation/AnimationList'
import NoPacksPlaceholder from '@/settings/components/NoPacksPlaceholder'
import usePagination from '@/settings/hooks/usePagination'
import { useData } from '@/modules/Data'
import PackSelect from '@/settings/components/pack/PackSelect'

function ModuleSettings ({ moduleId, refToScroller, pageSize = 15 }) {
  const [preferences] = useData('preferences')
  const module = useModule(moduleId, true)

  const onSelect = useCallback((type, pack, animation) => {
    if (!animation) module.setAnimation(type, null, null)
    else module.setAnimation(type, pack.slug, animation.key, {})
  }, [module])
  const setIsEnabled = useCallback(value => module.setIsEnabled(value), [module])

  const selected = module.getAnimations()

  const preinstalledPack = PackManager.getPack(PREINSTALLED_PACK_SLUG)
  const preinstalledAnimations = preinstalledPack?.animations.filter(a => module.isSupportedBy(a)) ?? []

  const packs = PackManager.getAllPacks()
    .filter(p => p.animations.some(a => module.isSupportedBy(a)))

  const [packSlug, setPackSlug] = useState(null)
  const pack = packs.find(pack => pack.slug === packSlug)

  const selectPack = useCallback(pack => {
    setPackSlug(pack.slug)
    preferences.pack = pack.slug
  }, [setPackSlug, preferences])
  const isPackActive = pack => Object.values(selected).some(data => data.pack?.slug === pack.slug)

  useEffect(() => {
    if (!pack) setPackSlug(
      packs.find(pack => pack.slug === selected.enter.pack?.slug)?.slug
      ?? packs.find(pack => pack.slug === preferences.pack)?.slug
      ?? packs[0]?.slug
      ?? null
    )
  }, [!pack])

  const animations = pack?.animations.filter(animation => module.isSupportedBy(animation)) ?? []

  const { page, setPage, items } = usePagination(
    animations,
    pageSize,
    [packSlug]
  )

  useEffect(() => {
    if (!pack) return

    const indexes = Object.values(selected).map(
      ({ packSlug, animationKey }) => packSlug === pack.slug
        ? animations.findIndex(animation => animation.key === animationKey)
        : -1
    ).filter(i => i !== -1)

    if (indexes.length) setPage(Math.min(...indexes.map(i => Math.floor(i / pageSize) + 1)))
  }, [packSlug])

  return (
    <ModuleContext value={module}>
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
          <>
            <PackSelect
              className="BA__moduleSettingsPackSelect"
              packs={packs}
              selected={packSlug}
              onSelect={selectPack}
              isActive={isPackActive}
            />
            {pack && (
              <div
                key={pack.slug}
                className="BA__moduleSettingsPack"
              >
                <AnimationList
                  module={module}
                  pack={pack}
                  animations={items}
                  selected={selected}
                  onSelect={onSelect}
                  refToScroller={refToScroller}
                />
                <Paginator
                  pageSize={pageSize}
                  totalCount={animations.length}
                  maxVisiblePages={5}
                  currentPage={page}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        ) : (
          <NoPacksPlaceholder />
        )}
      </div>
    </ModuleContext>
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
    background: var(--border-normal);
}
.BA__moduleSettingsSectionTitle > span {
    position: relative;
    background: var(--background-base-low);
    padding: 0 8px;
}

.BA__moduleSettingsPackSelect {
    margin-bottom: 12px;
}`
`ModuleSettings`
