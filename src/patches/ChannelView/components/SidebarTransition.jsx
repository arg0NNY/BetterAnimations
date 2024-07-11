import SwitchTransition from '@/components/SwitchTransition'
import AnimeTransition from '@/components/AnimeTransition'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import SwitchSidebarTransition from '@/patches/ChannelView/components/SwitchSidebarTransition'

function SidebarTransition ({ module, switchModule, state, children }) {
  const key = state?.type ?? 'none'

  return (
    <SwitchTransition>
      <AnimeTransition
        key={key}
        container={{ className: DiscordClasses.AppView.content, style: { flex: '0 0 auto' } }}
        module={module}
      >
        <SwitchSidebarTransition
          state={state}
          module={switchModule}
        >
          {children}
        </SwitchSidebarTransition>
      </AnimeTransition>
    </SwitchTransition>
  )
}

export default SidebarTransition
