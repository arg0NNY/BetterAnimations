import { TransitionGroup } from '@discord/modules'
import AnimeTransition from '@components/AnimeTransition'

function SwitchSidebarTransition ({
  transitionKey,
  injectContainerRef = true,
  ...props
}) {
  return (
    <TransitionGroup component={null}>
      <AnimeTransition
        key={transitionKey}
        injectContainerRef={injectContainerRef}
        {...props}
      />
    </TransitionGroup>
  )
}

export default SwitchSidebarTransition
