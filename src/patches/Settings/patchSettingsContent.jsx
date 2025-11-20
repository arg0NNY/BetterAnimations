import Patcher from '@/modules/Patcher'
import ModuleKey from '@enums/ModuleKey'
import { SettingsContent, SettingsNodeType, TransitionGroup } from '@discord/modules'
import useWindow from '@/hooks/useWindow'
import useModule from '@/hooks/useModule'
import { ErrorBoundary } from '@error/boundary'
import { css } from '@style'
import AnimeTransition from '@components/AnimeTransition'
import { passAuto } from '@utils/transition'
import DiscordSelectors from '@discord/selectors'
import { closest, flatten } from '@/utils/settings'
import { useMemo } from 'react'
import useDirection from '@/hooks/useDirection'

async function patchSettingsContent () {
  Patcher.after(ModuleKey.Settings, await SettingsContent, 'type', (self, [{ setting }], value) => {
    const root = useMemo(
      () => setting ? closest(setting, SettingsNodeType.ROOT) : null,
      [setting]
    )
    const panelKeys = useMemo(
      () => root
        ? flatten(root.layout, SettingsNodeType.PANEL).map(node => node.key)
        : [],
      [root]
    )
    const direction = useDirection(panelKeys, setting?.key)

    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Settings)
    if (!isMainWindow || !module.isEnabled()) return

    const auto = { direction }

    return (
      <ErrorBoundary module={module} fallback={value}>
        <TransitionGroup
          className="BA__settingsContent"
          childFactory={passAuto(auto)}
        >
          <AnimeTransition
            key={setting?.key ?? 'none'}
            container={{ className: 'BA__settingsContent' }}
            module={module}
            auto={auto}
          >
            {value}
          </AnimeTransition>
        </TransitionGroup>
      </ErrorBoundary>
    )
  })
}

export default patchSettingsContent

SettingsContent.then(() =>
css
`.BA__settingsContent {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

${DiscordSelectors.SettingsSidebar.sidebar} {
    isolation: isolate;
}`
`SettingsContent`
)
