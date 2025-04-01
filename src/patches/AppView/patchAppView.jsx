import { Patcher, Utils } from '@/BdApi'
import { AppPanels, AppView, ImpressionNames, Router, Routes, TransitionGroup } from '@/modules/DiscordModules'
import findInReactTree from '@/utils/findInReactTree'
import AnimeTransition from '@/components/AnimeTransition'
import useLocationKey from '@/hooks/useLocationKey'
import {
  getSwitchContentDirection,
  getSwitchPageDirection,
  shouldSwitchContent,
  shouldSwitchPage
} from '@/utils/locations'
import { passAuto } from '@/utils/transition'
import ModuleKey from '@/enums/ModuleKey'
import useModule from '@/hooks/useModule'
import patchMessageRequestsRoute from '@/patches/ChannelView/patchMessageRequestsRoute'
import { DiscordClasses, DiscordSelectors } from '@/modules/DiscordSelectors'
import { css } from '@/modules/Style'
import { Fragment } from 'react'

export let guildChannelPath = []

function AppViewTransition ({ className, module, shouldSwitch, getSwitchDirection, children }) {
  const [key, direction] = useLocationKey(shouldSwitch, getSwitchDirection)
  const auto = { direction }

  return (
    <TransitionGroup className={className} childFactory={passAuto(auto)}>
      <AnimeTransition
        key={key}
        container={{ className, defaultLayoutStyles: false }}
        freeze={true}
        module={module}
        auto={auto}
      >
        {children}
      </AnimeTransition>
    </TransitionGroup>
  )
}

const byClassName = className => m => m?.props?.className?.includes(className)

function patchAppView () {
  Patcher.after(...AppView, (self, args, value) => {
    const serversModule = useModule(ModuleKey.Servers)
    const channelsModule = useModule(ModuleKey.Channels)

    const base = findInReactTree(value, byClassName(DiscordClasses.AppView.base))
    if (!base) return

    const contentIndex = base.props.children.findIndex(byClassName(DiscordClasses.AppView.content))
    if (contentIndex === -1) return

    const content = base.props.children[contentIndex]
    if (serversModule.isEnabled()) base.props.children[contentIndex] = (
      <AppViewTransition
        className="BA__content"
        module={serversModule}
        shouldSwitch={shouldSwitchContent}
        getSwitchDirection={getSwitchContentDirection}
      >
        {content}
      </AppViewTransition>
    )

    const pageIndex = content.props.children.findIndex(byClassName(DiscordClasses.AppView.page))
    if (pageIndex === -1) return

    const page = content.props.children[pageIndex]
    if (channelsModule.isEnabled()) content.props.children[pageIndex] = (
      <AppViewTransition
        className="BA__page"
        module={channelsModule}
        shouldSwitch={shouldSwitchPage}
        getSwitchDirection={getSwitchPageDirection}
      >
        {page}
      </AppViewTransition>
    )

    const routes = findInReactTree(page, m => m?.type === Router.Switch)?.props.children

    const messageRequestsRoute = routes?.find(r => r?.props?.path === Routes.MESSAGE_REQUESTS)
    if (messageRequestsRoute) patchMessageRequestsRoute(messageRequestsRoute)

    const guildChannelRoute = routes?.find(r => r?.props?.impressionName === ImpressionNames.GUILD_CHANNEL)
    if (guildChannelRoute) guildChannelPath = guildChannelRoute.props.path

    // Enhance layout
    if (!serversModule.isEnabled() || !serversModule.settings.enhanceLayout) return

    base.props.className = Utils.className(base.props.className, 'BA__baseEnhancedLayout')

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
}

export default patchAppView

css
`.BA__content, .BA__page {
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
    grid-column: guildsEnd / end;
    grid-row: noticeEnd / end;
}
.BA__baseEnhancedLayout ${DiscordSelectors.AppView.sidebar} {
    grid-area: channelsList;
}
.BA__baseEnhancedLayout ${DiscordSelectors.AppView.panels} {
    width: calc(var(--custom-guild-sidebar-width) - var(--space-xs)*2);
    z-index: 100;
}`
`AppView (Servers, Channels)`
