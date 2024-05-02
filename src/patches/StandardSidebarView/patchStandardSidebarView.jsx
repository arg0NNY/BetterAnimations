import { Patcher } from '@/BdApi'
import { StandardSidebarView, StandardSidebarViewWrapper, TransitionGroup } from '@/modules/DiscordModules'
import findInReactTree from '@/helpers/findInReactTree'
import AnimeTransition from '@/components/AnimeTransition'
import { tempAnimationData } from '@/patches/AppView/patchAppView'
import { clearContainingStyles } from '@/helpers/transition'
import useDirection from '@/hooks/useDirection'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'

// TODO: Insert classes dynamically
async function patchStandardSidebarView () {
  Patcher.after((await StandardSidebarViewWrapper).default.prototype, 'render', (self, args, value) => {
    const view = findInReactTree(value, m => m?.props?.content && m?.props?.sidebar)
    if (!view) return

    view.props.sections = self.getPredicateSections().map(s => s.section)
  })

  Patcher.after(await StandardSidebarView, 'default', (self, [props], value) => {
    const standardSidebarView = findInReactTree(value, m => m?.className?.includes('standardSidebarView__12528'))
    if (!standardSidebarView) return

    const i = standardSidebarView.children.findIndex(i => i?.props?.className?.includes('contentRegion__08eba'))
    if (i === -1) return

    const contentRegion = standardSidebarView.children[i]

    const direction = useDirection(props.sections, props.section)
    const module = useModule(ModuleKey.Settings)
    if (!module.isEnabled()) return

    const animations = module.getAnimations({ auto: { direction } })

    const childFactory = e => {
      e.props.animations = animations
      return e
    }

    standardSidebarView.children[i] = (
      <TransitionGroup className="contentRegion__08eba" childFactory={childFactory}>
        <AnimeTransition
          key={props.section}
          animations={animations}
          options={{ type: 'switch'  }}
          onEntered={clearContainingStyles}
        >
          {contentRegion}
        </AnimeTransition>
      </TransitionGroup>
    )
  })
}

export default patchStandardSidebarView
