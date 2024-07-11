import { Patcher, React } from '@/BdApi'
import { AppView, Router, Routes, TransitionGroup } from '@/modules/DiscordModules'
import findInReactTree from '@/helpers/findInReactTree'
import AnimeTransition from '@/components/AnimeTransition'
import useLocationKey from '@/hooks/useLocationKey'
import {
  getSwitchBaseDirection,
  getSwitchContentDirection,
  shouldSwitchBase,
  shouldSwitchContent
} from '@/helpers/locations'
import { passAuto } from '@/helpers/transition'
import ModuleKey from '@/enums/ModuleKey'
import useModule from '@/hooks/useModule'
import patchMessageRequestsRoute from '@/patches/ChannelView/patchMessageRequestsRoute'
import { DiscordClasses, DiscordSelectors } from '@/modules/DiscordSelectors'
import { css } from '@/modules/Style'

function BaseView ({ module, children }) {
  const baseRef = React.useRef()
  const [key, direction] = useLocationKey(shouldSwitchBase, getSwitchBaseDirection)
  const auto = { direction }

  React.useLayoutEffect(() => {
    if (!baseRef.current) return

    const bdNotices = document.getElementById('bd-notices')
    if (bdNotices && bdNotices.parentElement !== baseRef.current) {
      bdNotices.replaceWith(bdNotices.cloneNode(true))
      baseRef.current.prepend(bdNotices)
    }
  })

  return (
    <TransitionGroup component={null} childFactory={passAuto(auto)}>
      <AnimeTransition
        key={key}
        container={{ className: 'BA__base' }}
        freeze={true}
        module={module}
        auto={auto}
      >
        <div className={DiscordClasses.AppView.base} ref={baseRef}>
          {children}
        </div>
      </AnimeTransition>
    </TransitionGroup>
  )
}

function ContentView ({ module, children }) {
  const [key, direction] = useLocationKey(shouldSwitchContent, getSwitchContentDirection)
  const auto = { direction }

  return (
    <TransitionGroup className={DiscordClasses.AppView.content} childFactory={passAuto(auto)}>
      <AnimeTransition
        key={key}
        container={{ className: DiscordClasses.AppView.content }}
        freeze={true}
        module={module}
        auto={auto}
      >
        <div className={DiscordClasses.AppView.content}>
          <Router.Switch location={location}>
            {children}
          </Router.Switch>
        </div>
      </AnimeTransition>
    </TransitionGroup>
  )
}

function patchAppView () {
  Patcher.after(...AppView, (self, args, value) => {
    const serversModule = useModule(ModuleKey.Servers)
    const channelsModule = useModule(ModuleKey.Channels)

    const base = findInReactTree(value, m => m?.className === DiscordClasses.AppView.base)
    if (!base) return

    if (serversModule.isEnabled()) {
      base.className = 'BA__base'
      base.children = <BaseView module={serversModule}>{base.children}</BaseView>
    }

    const content = findInReactTree(base, m => m?.props?.className === DiscordClasses.AppView.content)
    if (!content) return

    const view = findInReactTree(content, m => m?.children?.type === Router.Switch)
    const routes = view.children.props.children

    const messageRequestsRoute = routes.find(r => r?.props?.path === Routes.MESSAGE_REQUESTS)
    if (messageRequestsRoute) patchMessageRequestsRoute(messageRequestsRoute)

    if (channelsModule.isEnabled())
      view.children = <ContentView module={channelsModule}>{routes}</ContentView>
  })
}

export default patchAppView

css
`${DiscordSelectors.AppView.container} {
    overflow: clip; /* Fix whole app jumping with sidebar animations */
}
.BA__base {
    /* Keep up-to-date with DiscordClasses.AppView.base */
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    flex-grow: 1;
}
${DiscordSelectors.AppView.base}, .BA__base {
    min-width: 0;
    min-height: 0;
    overflow: visible;
}
${DiscordSelectors.AppView.content}:has(> [data-animation-type]) {
    position: relative;
}`
`AppView (Servers, Channels)`
