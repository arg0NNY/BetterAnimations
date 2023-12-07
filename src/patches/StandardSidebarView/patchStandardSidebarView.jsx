import { Patcher } from '@/BdApi'
import { StandardSidebarView, StandardSidebarViewWrapper, TransitionGroup } from '@/modules/DiscordModules'
import findInReactTree from '@/helpers/findInReactTree'
import AnimeTransition from '@/components/AnimeTransition'
import { tempAnimationData } from '@/patches/AppView/patchAppView'
import { clearContainingStyles } from '@/helpers/transition'
import useDirection from '@/hooks/useDirection'

// TODO: Insert classes dynamically
async function patchStandardSidebarView () {
  Patcher.after((await StandardSidebarViewWrapper).default.prototype, 'render', (self, args, value) => {
    const view = findInReactTree(value, m => m?.props?.content && m?.props?.sidebar)
    if (!view) return

    view.props.sections = self.getPredicateSections().map(s => s.section)
  })

  Patcher.after(await StandardSidebarView, 'default', (self, [props], value) => {
    const standardSidebarView = findInReactTree(value, m => m?.className?.includes('standardSidebarView__1129a'))
    if (!standardSidebarView) return

    const i = standardSidebarView.children.findIndex(i => i?.props?.className?.includes('contentRegion__0bec1'))
    if (i === -1) return

    const contentRegion = standardSidebarView.children[i]

    const context = {
      direction: useDirection(props.sections, props.section)
    }

    const childFactory = e => {
      e.props.context = context
      return e
    }

    standardSidebarView.children[i] = (
      <TransitionGroup className="contentRegion__0bec1" childFactory={childFactory}>
        <AnimeTransition
          key={props.section}
          animation={tempAnimationData}
          context={context}
          options={{
            type: 'switch'
          }}
          onEntered={clearContainingStyles}
        >
          {contentRegion}
        </AnimeTransition>
      </TransitionGroup>
    )
  })
}

export default patchStandardSidebarView
