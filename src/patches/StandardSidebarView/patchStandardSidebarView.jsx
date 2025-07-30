import Patcher from '@/modules/Patcher'
import { StandardSidebarViewKeyed, StandardSidebarViewWrapper, TransitionGroup } from '@discord/modules'
import findInReactTree, { byClassName } from '@/utils/findInReactTree'
import AnimeTransition from '@components/AnimeTransition'
import { passAuto } from '@utils/transition'
import useDirection from '@/hooks/useDirection'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import DiscordClasses from '@discord/classes'
import DiscordSelectors from '@discord/selectors'
import { css } from '@style'
import useWindow from '@/hooks/useWindow'
import { ErrorBoundary } from '@error/boundary'

async function patchStandardSidebarView () {
  Patcher.after((await StandardSidebarViewWrapper).prototype, 'render', (self, args, value) => {
    const view = findInReactTree(value, m => m?.props?.content && m?.props?.sidebar)
    if (!view) return

    view.props.sections = self.getPredicateSections().map(s => s.section)
  })

  Patcher.after(...await StandardSidebarViewKeyed, (self, [props], value) => {
    const direction = useDirection(props.sections, props.section)
    const { isMainWindow } = useWindow()

    const module = useModule(ModuleKey.Settings)
    const layersModule = useModule(ModuleKey.Layers)
    if (!isMainWindow) return

    if (layersModule.isEnabled()) {
      // Disable Discord's internal animations, for Layers module
      const animated = findInReactTree(value, m => m?.type?.displayName?.startsWith('Animated'))
      if (animated) {
        delete animated.props.style
        animated.type = 'div'
      }
    }

    if (!module.isEnabled()) return

    const standardSidebarView = findInReactTree(value, byClassName(DiscordClasses.StandardSidebarView.standardSidebarView))
    if (!standardSidebarView) return

    const { children } = standardSidebarView.props
    const i = children.findIndex(byClassName(DiscordClasses.StandardSidebarView.contentRegion))
    if (i === -1) return

    const contentRegion = children[i]
    const auto = { direction }

    children[i] = (
      <ErrorBoundary module={module} fallback={contentRegion}>
        <TransitionGroup className={DiscordClasses.StandardSidebarView.contentRegion} childFactory={passAuto(auto)}>
          <AnimeTransition
            key={props.section}
            container={{ className: DiscordClasses.StandardSidebarView.contentRegion }}
            module={module}
            auto={auto}
          >
            {contentRegion}
          </AnimeTransition>
        </TransitionGroup>
      </ErrorBoundary>
    )
  })
}

export default patchStandardSidebarView

StandardSidebarViewKeyed.then(() =>
css
`${DiscordSelectors.StandardSidebarView.standardSidebarView} > ${DiscordSelectors.StandardSidebarView.contentRegion} {
    isolation: isolate;
    z-index: 2; /* Allow overflowing the sidebar */
}
${DiscordSelectors.StandardSidebarView.contentRegion} > ${DiscordSelectors.StandardSidebarView.contentRegion} {
    height: 100%;
}
${DiscordSelectors.StandardSidebarView.contentRegion}[data-ba-container] {
    background: none;
}

.platform-win ${DiscordSelectors.StandardSidebarView.contentRegionScroller} {
    height: calc(100% - var(--custom-app-top-bar-height));
}

${DiscordSelectors.StandardSidebarView.contentRegionScroller}:has(.BA__home) {
    overflow: visible !important;
}`
`StandardSidebarView (Settings)`
)
