import { Patcher, React } from '@/BdApi'
import { AppView, Router, TransitionGroup } from '@/modules/DiscordModules'
import findInReactTree from '@/helpers/findInReactTree'
import CloneTransition from '@/components/CloneTransition'
import useLocationKey from '@/hooks/useLocationKey'
import { shouldSwitchBase, shouldSwitchContent } from '@/helpers/locations'
import animation from '../../../examples/example.animation.json'
import { parseAnimationData } from '@/modules/Animation/parser'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { clearContainingStyles } from '@/helpers/transition'

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

  return (
    <TransitionGroup component={null}>
      <CloneTransition
        key={key}
        animation={tempAnimationData}
        options={{
          type: 'switch'
        }}
        onEntered={clearContainingStyles}
      >
        <div className="base__3e6af">
          {children}
        </div>
      </CloneTransition>
    </TransitionGroup>
  )
}

function ContentView ({ children }) {
  const key = useLocationKey(shouldSwitchContent)

  return (
    <TransitionGroup className="content__4bf10">
      <CloneTransition
        key={key}
        animation={tempAnimationData}
        options={{
          type: 'switch'
        }}
        onEntered={clearContainingStyles}
      >
        <div className="content__4bf10">
          <Router.Switch location={location}>
            {children}
          </Router.Switch>
        </div>
      </CloneTransition>
    </TransitionGroup>
  )
}

function patchAppView () {
  Patcher.after(AppView, 'default', (self, args, value) => {
    const base = findInReactTree(value, m => m?.props?.className === 'base__3e6af')
    if (!base) return

    base.props.children = <BaseView>{base.props.children}</BaseView>

    const content = findInReactTree(base, m => m?.props?.className === 'content__4bf10')
    if (!content) return

    const view = findInReactTree(content, m => m?.children?.type === Router.Switch)
    const routes = view.children.props.children

    view.children = <ContentView>{routes}</ContentView>

    // console.log(view)
  })
}

export default patchAppView
