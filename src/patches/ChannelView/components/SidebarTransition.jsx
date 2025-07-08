import SwitchTransition from '@/components/SwitchTransition'
import AnimeTransition from '@components/AnimeTransition'
import SwitchSidebarTransition from '@/patches/ChannelView/components/SwitchSidebarTransition'

function SidebarTransition ({ module, switchModule, state, injectContainerRef, children }) {
  const key = state?.type ?? 'none'

  return (
    <SwitchTransition>
      <AnimeTransition
        key={key}
        container={{ className: 'BA__sidebar' }}
        module={module}
      >
        <SwitchSidebarTransition
          state={state}
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
