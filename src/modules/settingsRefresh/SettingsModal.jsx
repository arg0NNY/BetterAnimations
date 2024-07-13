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
import ModuleKey from '@/enums/ModuleKey'

const StandardSidebarViewComponent = React.lazy(async () => ({ default: await StandardSidebarViewWrapper }))

function SettingsModal ({ initialSection = ModuleKey.Servers }) {
  const theme = useStateFromStores([ThemeStore], () => ThemeStore.theme)
  const sidebarTheme = useStateFromStores([ThemeStore], () => ThemeStore.darkSidebar ? Constants.Themes.DARK : undefined)

  const title = `${meta.name} Settings`
  const sections = React.useMemo(getSections, [])
  const [section, setSection] = React.useState(initialSection)

  return (
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
  )
}

export default SettingsModal
