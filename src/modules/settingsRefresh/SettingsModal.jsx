import {
  Constants,
  LayerActions,
  StandardSidebarView,
  StandardSidebarViewWrapper,
  ThemeStore,
  useStateFromStores
} from '@/modules/DiscordModules'
import { getSections } from '@/modules/settingsRefresh/data/sections'
import meta from '@/meta'
import SectionContext from '@/modules/settingsRefresh/context/SectionContext'
import { css } from '@/modules/Style'
import SettingsSections from '@/enums/SettingsSections'
import SettingsStore from '@/modules/settingsRefresh/stores/SettingsStore'
import { DiscordSelectors } from '@/modules/DiscordSelectors'
import { useCallback, useMemo, useState, Suspense, lazy } from 'react'

const StandardSidebarViewComponent = lazy(async () => ({ default: await StandardSidebarViewWrapper }))

function SettingsModal ({ initialSection = SettingsSections.Home }) {
  const theme = useStateFromStores([ThemeStore], () => ThemeStore.theme)
  const sidebarTheme = useStateFromStores([ThemeStore], () => ThemeStore.darkSidebar ? Constants.Themes.DARK : undefined)

  const title = `${meta.name} Settings`
  const sections = useMemo(getSections, [])
  const [section, setSection] = useState(initialSection)

  const onClose = useCallback(() => {
    if (SettingsStore.preventCloseIfNeeded()) return
    LayerActions.popLayer()
  }, [])

  return (
    <SectionContext.Provider value={{ section, setSection }}>
      <div className="BA__settingsModal">
        <Suspense>
          <StandardSidebarViewComponent
            title={title}
            theme={theme}
            sidebarTheme={sidebarTheme}
            sections={sections}
            section={section}
            onSetSection={setSection}
            onClose={onClose}
          />
        </Suspense>
      </div>
    </SectionContext.Provider>
  )
}

export default SettingsModal

StandardSidebarView.then(() =>
css
`.BA__settingsModal ${DiscordSelectors.StandardSidebarView.tools} {
    z-index: 100;
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
