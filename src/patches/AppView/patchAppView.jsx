import { Patcher, React } from '@/BdApi'
import { AppView, Router, TransitionGroup } from '@/modules/DiscordModules'
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
        clone={true}
        animations={animations}
        options={{ type: 'switch' }}
        onEntered={clearContainingStyles}
      >
        <div className="base_c0676e">
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
        clone={true}
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

    view.children = <ContentView>{routes}</ContentView>

    // console.log(view)
  })
}

export default patchAppView
