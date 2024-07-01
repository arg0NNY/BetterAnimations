import { TransitionGroup } from '@/modules/DiscordModules'
import AnimeTransition from '@/components/AnimeTransition'

function SwitchSidebarTransition ({ state, ...props }) {
  const key = JSON.stringify(state)

  return (
    <TransitionGroup component={null}>
      <AnimeTransition
        key={key}
        targetContainer={e => e}
        {...props}
      />
    </TransitionGroup>
  )
}

export default SwitchSidebarTransition
