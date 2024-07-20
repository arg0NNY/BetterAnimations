import { Patcher } from '@/BdApi'
import { StandardSidebarView, StandardSidebarViewWrapper, TransitionGroup } from '@/modules/DiscordModules'
import findInReactTree from '@/helpers/findInReactTree'
import AnimeTransition from '@/components/AnimeTransition'
import { passAuto } from '@/helpers/transition'
import useDirection from '@/hooks/useDirection'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import { DiscordClasses, DiscordSelectors } from '@/modules/DiscordSelectors'
import { css } from '@/modules/Style'

async function patchStandardSidebarView () {
  Patcher.after((await StandardSidebarViewWrapper).prototype, 'render', (self, args, value) => {
    const view = findInReactTree(value, m => m?.props?.content && m?.props?.sidebar)
    if (!view) return

    view.props.sections = self.getPredicateSections().map(s => s.section)
  })

  Patcher.after(...await StandardSidebarView, (self, [props], value) => {
    const direction = useDirection(props.sections, props.section)
    const module = useModule(ModuleKey.Settings)
    if (!module.isEnabled()) return

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
    )
  })
}

export default patchStandardSidebarView

StandardSidebarView.then(() =>
css
`${DiscordSelectors.StandardSidebarView.contentRegion} > ${DiscordSelectors.StandardSidebarView.contentRegion} {
    height: 100%;
}

${DiscordSelectors.StandardSidebarView.contentColumnDefault}:has(> .BA__moduleSettings) {
    position: static;
}`
`StandardSidebarView (Settings)`
)
