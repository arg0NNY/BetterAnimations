import { Patcher } from '@/BdApi'
import { StandardSidebarView, TransitionGroup } from '@/modules/DiscordModules'
import findInReactTree from '@/helpers/findInReactTree'
import CloneTransition from '@/components/CloneTransition'
import { tempAnimationData } from '@/patches/AppView/patchAppView'
import { clearContainingStyles } from '@/helpers/transition'

// TODO: Insert classes dynamically
async function patchStandardSidebarView () {
  Patcher.after(await StandardSidebarView, 'default', (self, [props], value) => {
    const standardSidebarView = findInReactTree(value, m => m?.className?.includes('standardSidebarView__1129a'))
    if (!standardSidebarView) return

    const i = standardSidebarView.children.findIndex(i => i?.props?.className?.includes('contentRegion__0bec1'))
    if (i === -1) return

    const contentRegion = standardSidebarView.children[i]

    standardSidebarView.children[i] = (
      <TransitionGroup className="contentRegion__0bec1">
        <CloneTransition
          key={props.section}
          clone={false}
          animation={tempAnimationData}
          options={{
            type: 'switch'
          }}
          onEntered={clearContainingStyles}
        >
          {contentRegion}
        </CloneTransition>
      </TransitionGroup>
    )
  })
}

export default patchStandardSidebarView
