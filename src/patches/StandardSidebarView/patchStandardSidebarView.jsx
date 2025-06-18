import Patcher from '@/modules/Patcher'
import { StandardSidebarViewKeyed, StandardSidebarViewWrapper, TransitionGroup } from '@discord/modules'
import findInReactTree from '@/utils/findInReactTree'
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

  Patcher.after(ModuleKey.Settings, ...await StandardSidebarViewKeyed, (self, [props], value) => {
    const direction = useDirection(props.sections, props.section)
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Settings)
    if (!isMainWindow || !module.isEnabled()) return

    // Disable Discord's internal animations, for Layers module
    const animated = findInReactTree(value, m => m?.type?.displayName?.startsWith('Animated'))
    if (animated) {
      delete animated.props.style
      animated.type = 'div'
    }

    const standardSidebarView = findInReactTree(value, m => m?.className?.includes(DiscordClasses.StandardSidebarView.standardSidebarView))
    if (!standardSidebarView) return

    const i = standardSidebarView.children.findIndex(i => i?.props?.className?.includes(DiscordClasses.StandardSidebarView.contentRegion))
    if (i === -1) return

    const contentRegion = standardSidebarView.children[i]

    const auto = { direction }

    standardSidebarView.children[i] = (
      <ErrorBoundary module={module} fallback={contentRegion}>
        <TransitionGroup className={DiscordClasses.StandardSidebarView.contentRegion} childFactory={passAuto(auto)}>
          <AnimeTransition
            key={props.section}
            container={{ className: DiscordClasses.StandardSidebarView.contentRegion }}
            freeze={true}
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
