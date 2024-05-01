import { Patcher, React } from '@/BdApi'
import { AppView, Router, TransitionGroup } from '@/modules/DiscordModules'
import findInReactTree from '@/helpers/findInReactTree'
import AnimeTransition from '@/components/AnimeTransition'
import useLocationKey from '@/hooks/useLocationKey'
import { shouldSwitchBase, shouldSwitchContent } from '@/helpers/locations'
import animation from '../../../examples/example.animation.json'
import { parseAnimationData } from '@/modules/Animation/parser'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { clearContainingStyles } from '@/helpers/transition'
import Modules from '@/modules/Modules'
import ModuleKey from '@/enums/ModuleKey'

// TODO: Insert classes dynamically

export let tempAnimationData
try {
  tempAnimationData = parseAnimationData(animation)
}
catch (e) {
  e = e instanceof z.ZodError ? fromZodError(e).message : e
  console.error('Failed to load animation:', e)
}

function BaseView ({ children }) {
  const key = useLocationKey(shouldSwitchBase)

  const module = Modules.getModule(ModuleKey.Servers)
  if (!module.isEnabled()) return children

  return (
    <TransitionGroup component={null}>
      <AnimeTransition
        key={key}
        clone={true}
        animations={module.getAnimations()}
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
  const key = useLocationKey(shouldSwitchContent)

  return (
    <TransitionGroup className="content__76dcf">
      <AnimeTransition
        key={key}
        clone={true}
        animation={tempAnimationData}
        options={{
          type: 'switch'
        }}
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
