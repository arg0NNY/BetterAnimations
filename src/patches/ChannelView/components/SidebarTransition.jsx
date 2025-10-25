import SwitchTransition from '@/components/SwitchTransition'
import AnimeTransition from '@components/AnimeTransition'
import SwitchSidebarTransition from '@/patches/ChannelView/components/SwitchSidebarTransition'
import { pick } from '@utils/object'
import { SidebarType } from '@discord/modules'

function buildSwitchKey (state) {
  return JSON.stringify(
    state?.type === SidebarType.VIEW_MOD_REPORT
      ? {
          ...state,
          details: pick(state.details, ['userId'])
        }
      : state
  )
}

function SidebarTransition ({
  module,
  switchModule,
  state,
  transitionKey = state?.type ?? 'none',
  switchTransitionKey = buildSwitchKey(state),
  injectContainerRef,
  children
}) {
  return (
    <SwitchTransition>
      <AnimeTransition
        key={transitionKey}
        container={{ className: 'BA__sidebar' }}
        module={module}
      >
        <SwitchSidebarTransition
          transitionKey={switchTransitionKey}
          module={switchModule}
          injectContainerRef={injectContainerRef}
        >
          {children}
        </SwitchSidebarTransition>
      </AnimeTransition>
    </SwitchTransition>
  )
}

export default SidebarTransition
