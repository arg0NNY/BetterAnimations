import {
  Button,
  LayerActions,
  StandardSidebarViewKeyed,
  StandardSidebarViewWrapper,
  ThemeStore,
  useStateFromStores
} from '@discord/modules'
import { useSections } from '@/settings/data/sections'
import meta from '@/meta'
import SectionContext from '@/settings/context/SectionContext'
import { css } from '@style'
import { useSection } from '@/settings/stores/SettingsStore'
import DiscordSelectors from '@discord/selectors'
import { useCallback, Suspense, lazy, useEffect } from 'react'
import { ErrorBoundary } from '@error/boundary'
import PackRegistry from '@/modules/PackRegistry'

const StandardSidebarViewComponent = lazy(async () => ({ default: await StandardSidebarViewWrapper }))

function SettingsModal () {
  const theme = useStateFromStores([ThemeStore], () => ThemeStore.theme)

  const title = `${meta.name} Settings`
  const sections = useSections()
  const [section, setSection] = useSection()

  const onClose = useCallback(() => LayerActions.popLayer(), [])

  const actions = actions => (
    <>
      {actions}
      <Button
        variant="secondary"
        size="sm"
        text="Close Settings"
        onClick={onClose}
      />
    </>
  )

  useEffect(() => () => PackRegistry.storage.clear(), [])

  return (
    <ErrorBoundary style={{ margin: 'auto' }} actions={actions}>
      <SectionContext value={{ section, setSection }}>
        <div className="BA__settingsModal">
          <Suspense>
            <StandardSidebarViewComponent
              title={title}
              theme={theme}
              sidebarTheme={theme}
              sections={sections}
              section={section}
              onSetSection={setSection}
              onClose={onClose}
            />
          </Suspense>
        </div>
      </SectionContext>
    </ErrorBoundary>
  )
}

export default SettingsModal

StandardSidebarViewKeyed.then(() =>
css
`.BA__settingsModal {
    position: absolute;
    inset: 0;
}
.BA__settingsModal ${DiscordSelectors.StandardSidebarView.noticeRegion} {
    padding-left: 40px;
    padding-right: 40px;
    z-index: 200;
}

${DiscordSelectors.StandardSidebarView.contentColumnDefault}:has(> .BA__moduleSettings) {
    position: static;
}

.BA__nestedTabBarItem {
    position: relative;
    margin-left: 30px;
    overflow: visible;
}
.BA__nestedTabBarItem svg {
    position: absolute;
    left: -14px;
    bottom: calc(50% - 1px);
    color: var(--interactive-muted);
}`
`SettingsModal`
)
