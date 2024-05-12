import { Patcher, React } from '@/BdApi'
import { AppView, Constants, Router, TransitionGroup } from '@/modules/DiscordModules'
import findInReactTree from '@/helpers/findInReactTree'
import AnimeTransition from '@/components/AnimeTransition'
import useLocationKey from '@/hooks/useLocationKey'
import {
  getSwitchBaseDirection,
  getSwitchContentDirection,
  shouldSwitchBase,
  shouldSwitchContent
} from '@/helpers/locations'
import { clearContainingStyles, passAnimations } from '@/helpers/transition'
import ModuleKey from '@/enums/ModuleKey'
import useModule from '@/hooks/useModule'
import patchMessageRequestsRoute from '@/patches/ChannelView/patchMessageRequestsRoute'

// TODO: Restructurize "patches" folder, make it so each folder represents a module, not a component that it patches

// TODO: Insert classes dynamically

function BaseView ({ children }) {
  const [key, direction] = useLocationKey(shouldSwitchBase, getSwitchBaseDirection)

  const module = useModule(ModuleKey.Servers)
  if (!module.isEnabled()) return children

  const animations = module.getAnimations({ auto: { direction } })

  return (
    <TransitionGroup component={null} childFactory={passAnimations(animations)}>
      <AnimeTransition
        key={key}
        container={{ className: 'base_c0676e' }}
        freeze={true}
        animations={animations}
        options={{ type: 'switch' }}
        onEntered={clearContainingStyles}
      >
        <div className="base_c0676e"> {/* TODO: Make this a custom class, unified container. `base_XXX` inside `base_XXX` is screwing up the BD notices. Do the same for `content_XXX` below. */}
          {children}
        </div>
      </AnimeTransition>
    </TransitionGroup>
  )
}

function ContentView ({ children }) {
  const [key, direction] = useLocationKey(shouldSwitchContent, getSwitchContentDirection)

  const module = useModule(ModuleKey.Channels)
  if (!module.isEnabled()) return (
    <Router.Switch location={location}>
      {children}
    </Router.Switch>
  )

  const animations = module.getAnimations({ auto: { direction } })

  return (
    <TransitionGroup className="content__76dcf" childFactory={passAnimations(animations)}>
      <AnimeTransition
        key={key}
        container={{ className: 'content__76dcf' }}
        freeze={true}
        animations={animations}
        options={{ type: 'switch' }}
        onEntered={clearContainingStyles}
      >
        <div className="content__76dcf">
          <Router.Switch location={location}>
            {children}
          </Router.Switch>
        </div>
      </AnimeTransition>
    </TransitionGroup>
  )
}

function patchAppView () {
  Patcher.after(AppView, 'default', (self, args, value) => {
    const base = findInReactTree(value, m => m?.props?.className === 'base_c0676e')
    if (!base) return

    base.props.children = <BaseView>{base.props.children}</BaseView>

    const content = findInReactTree(base, m => m?.props?.className === 'content__76dcf')
    if (!content) return

    const view = findInReactTree(content, m => m?.children?.type === Router.Switch)
    const routes = view.children.props.children

    const messageRequestsRoute = routes.find(r => r?.props?.path === Constants.Routes.MESSAGE_REQUESTS)
    if (messageRequestsRoute) patchMessageRequestsRoute(messageRequestsRoute)

    view.children = <ContentView>{routes}</ContentView>

    // console.log(view)
  })
}

export default patchAppView
