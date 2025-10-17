import Patcher from '@/modules/Patcher'
import { AppPanels, AppViewKeyed, ImpressionNames, Router, TransitionGroup } from '@discord/modules'
import findInReactTree, { byClassName } from '@/utils/findInReactTree'
import AnimeTransition from '@components/AnimeTransition'
import useLocationKey from '@/hooks/useLocationKey'
import {
  getSwitchContentDirection,
  getSwitchPageDirection,
  shouldSwitchContent,
  shouldSwitchPage
} from '@/utils/locations'
import { passAuto } from '@utils/transition'
import ModuleKey from '@enums/ModuleKey'
import useModule from '@/hooks/useModule'
import DiscordClasses from '@discord/classes'
import DiscordSelectors from '@discord/selectors'
import { css } from '@style'
import { Fragment, useEffect, useState } from 'react'
import useWindow from '@/hooks/useWindow'
import classNames from 'classnames'
import { ErrorBoundary } from '@error/boundary'
import { forceAppUpdate } from '@/utils/forceUpdate'
import patchAppPanels from '@/patches/AppView/patchAppPanels'

export let guildChannelPath = []

function useServersModule () {
  const module = useModule(ModuleKey.Servers, true)

  const currentState = {
    isEnabled: module.isEnabled(),
    isEnhancedLayout: module.isEnabled() && module.settings.enhanceLayout
  }

  const [isEnabled, setIsEnabled] = useState(currentState.isEnabled)
  const [isEnhancedLayout] = useState(currentState.isEnhancedLayout)

  useEffect(() => {
    if (isEnhancedLayout !== currentState.isEnhancedLayout) forceAppUpdate()
    else if (isEnabled !== currentState.isEnabled) setIsEnabled(currentState.isEnabled)
  }, [currentState.isEnabled, currentState.isEnhancedLayout])

  return { module, isEnabled, isEnhancedLayout }
}

function AppViewTransition ({ className, module, shouldSwitch, getSwitchDirection, children }) {
  const [key, direction] = useLocationKey(shouldSwitch, getSwitchDirection)
  const auto = { direction }

  return (
    <TransitionGroup className={className} childFactory={passAuto(auto)}>
      <AnimeTransition
        key={key}
        container={{ className }}
        defaultLayoutStyles={false}
        freeze={true}
        module={module}
        auto={auto}
      >
        {children}
      </AnimeTransition>
    </TransitionGroup>
  )
}

function patchAppView () {
  Patcher.after(...AppViewKeyed, (self, args, value) => {
    const { isMainWindow } = useWindow()
    const {
      module: serversModule,
      isEnabled: isServersModuleEnabled,
      isEnhancedLayout
    } = useServersModule()
    const channelsModule = useModule(ModuleKey.Channels)
    if (!isMainWindow) return

    const base = findInReactTree(value, byClassName(DiscordClasses.AppView.base))
    if (!base) return

    const contentIndex = base.props.children.findIndex(byClassName(DiscordClasses.AppView.content))
    if (contentIndex === -1) return

    const content = base.props.children[contentIndex]
    if (isServersModuleEnabled) base.props.children[contentIndex] = (
      <ErrorBoundary module={serversModule} fallback={content}>
        <AppViewTransition
          className="BA__content"
          module={serversModule}
          shouldSwitch={shouldSwitchContent}
          getSwitchDirection={getSwitchContentDirection}
        >
          {content}
        </AppViewTransition>
      </ErrorBoundary>
    )

    const pageIndex = content.props.children.findIndex(byClassName(DiscordClasses.AppView.page))
    if (pageIndex === -1) return

    const page = content.props.children[pageIndex]
    if (channelsModule.isEnabled()) content.props.children[pageIndex] = (
      <ErrorBoundary module={channelsModule} fallback={page}>
        <AppViewTransition
          className="BA__page"
          module={channelsModule}
          shouldSwitch={shouldSwitchPage}
          getSwitchDirection={getSwitchPageDirection}
        >
          {page}
        </AppViewTransition>
      </ErrorBoundary>
    )

    const routes = findInReactTree(page, m => m?.type === Router.Switch)?.props.children

    const guildChannelRoute = routes?.find(r => r?.props?.impressionName === ImpressionNames.GUILD_CHANNEL && Array.isArray(r.props.path))
    if (guildChannelRoute) guildChannelPath = guildChannelRoute.props.path

    // Enhance layout
    if (!isEnhancedLayout) return

    base.props.className = classNames(base.props.className, 'BA__baseEnhancedLayout')

    const sidebarIndex = content.props.children.findIndex(m => 'isSidebarOpen' in (m?.props ?? {}))
    if (sidebarIndex === -1) return

    // Render nested sidebar components
    const sidebar = content.props.children[sidebarIndex]
    let renderedSidebar = sidebar.type(sidebar.props)
    renderedSidebar = renderedSidebar.type(renderedSidebar.props)

    const sidebarContainer = findInReactTree(renderedSidebar, byClassName(DiscordClasses.AppView.sidebar))
    if (sidebarContainer) {
      // Get rid of fragments
      sidebarContainer.props.children = sidebarContainer.props.children
        .flatMap(m => m?.type === Fragment ? m.props.children : m)

      // Move guilds list to base
      const guildsIndex = sidebarContainer.props.children.findIndex(byClassName(DiscordClasses.AppView.guilds))
      if (guildsIndex !== -1) {
        base.props.children.splice(
          contentIndex,
          0,
          ...sidebarContainer.props.children.splice(guildsIndex, 1)
        )
      }

      // Move panels to base
      const panelsIndex = sidebarContainer.props.children.findIndex(m => m?.type === AppPanels)
      if (panelsIndex !== -1) {
        base.props.children.push(
          ...sidebarContainer.props.children.splice(panelsIndex, 1)
        )
      }
    }

    content.props.children[sidebarIndex] = renderedSidebar
  })

  patchAppPanels()
}

export default patchAppView

css
`.BA__content, .BA__page {
    position: relative;
    isolation: isolate;
    display: grid;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
    min-width: 0;
    min-height: 0;
    flex: 1;
}
.BA__content {
    grid-column: start / end;
    grid-row: titleBarEnd / end;
}
.BA__page {
    grid-area: page;
}

.BA__baseEnhancedLayout :is(.BA__content, ${DiscordSelectors.AppView.content}) {
    /* Indexes used instead of labels to solve conflicts with ServerFolders */
    grid-column: -3 / end;
    grid-row: -2 / end;
}
.BA__baseEnhancedLayout ${DiscordSelectors.AppView.sidebar} {
    grid-area: channelsList;
}
.BA__baseEnhancedLayout ${DiscordSelectors.AppView.panels} {
    width: calc(var(--custom-guild-sidebar-width) - var(--space-xs)*2);
    z-index: 100;
}

/* Hide the moved elements in the fullscreen voice call */
.BA__baseEnhancedLayout[data-fullscreen="true"] :is(${DiscordSelectors.AppView.guilds}, ${DiscordSelectors.AppView.panels}) {
    display: none;
}

/* Fix for ServerFolders */
.BA__baseEnhancedLayout ${DiscordSelectors.AppView.guilds}[class*="closed"] {
    display: none;
}`
`AppView (Servers, Channels)`
