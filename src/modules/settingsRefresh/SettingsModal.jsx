import { React } from '@/BdApi'
import {
  Constants,
  LayerActions,
  StandardSidebarViewWrapper,
  ThemeStore,
  useStateFromStores
} from '@/modules/DiscordModules'
import { getSections } from '@/modules/settingsRefresh/data/sections'
import meta from '@/meta'
import SectionContext from '@/modules/settingsRefresh/context/SectionContext'
import { css } from '@/modules/Style'
import SettingsSections from '@/enums/SettingsSections'

const StandardSidebarViewComponent = React.lazy(async () => ({ default: await StandardSidebarViewWrapper }))

function SettingsModal ({ initialSection = SettingsSections.Home }) {
  const theme = useStateFromStores([ThemeStore], () => ThemeStore.theme)
  const sidebarTheme = useStateFromStores([ThemeStore], () => ThemeStore.darkSidebar ? Constants.Themes.DARK : undefined)

  const title = `${meta.name} Settings`
  const sections = React.useMemo(getSections, [])
  const [section, setSection] = React.useState(initialSection)

  return (
    <SectionContext.Provider value={{ section, setSection }}>
      <React.Suspense>
        <StandardSidebarViewComponent
          title={title}
          theme={theme}
          sidebarTheme={sidebarTheme}
          sections={sections}
          section={section}
          onSetSection={setSection}
          onClose={LayerActions.popLayer}
        />
      </React.Suspense>
    </SectionContext.Provider>
  )
}

export default SettingsModal

css
`.BA__nestedTabBarItem {
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
