import { TransitionGroup } from '@discord/modules'
import AnimeTransition from '@components/AnimeTransition'

function SwitchSidebarTransition ({ state, injectContainerRef = true, ...props }) {
  const key = JSON.stringify(state)

  return (
    <TransitionGroup component={null}>
      <AnimeTransition
        key={key}
        injectContainerRef={injectContainerRef}
        {...props}
      />
    </TransitionGroup>
  )
}

export default SwitchSidebarTransition
