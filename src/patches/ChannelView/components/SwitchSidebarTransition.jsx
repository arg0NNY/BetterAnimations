import { TransitionGroup } from '@discord/modules'
import AnimeTransition from '@components/AnimeTransition'

function SwitchSidebarTransition ({ state, ...props }) {
  const key = JSON.stringify(state)

  return (
    <TransitionGroup component={null}>
      <AnimeTransition
        key={key}
        injectContainerRef={true}
        {...props}
      />
    </TransitionGroup>
  )
}

export default SwitchSidebarTransition
