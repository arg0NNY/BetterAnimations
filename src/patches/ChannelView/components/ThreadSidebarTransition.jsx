import { DiscordSelectors } from '@/modules/DiscordSelectors'
import AnimeTransition from '@/components/AnimeTransition'
import animate from '@/patches/ChannelView/helpers/animate'

function ThreadSidebarTransition (props) {
  const modifier = type => ({ node }) => {
    let width = node.classList.contains(DiscordSelectors.ThreadSidebar.chatLayerWrapper.slice(1))
      ? node.querySelector(`${DiscordSelectors.ThreadSidebar.container}:not(${DiscordSelectors.ThreadSidebar.chatTarget})`)?.clientWidth
      : node.clientWidth + (node.classList.length ? 8 : 0)

    return animate(type, node, width)
  }

  return (
    <AnimeTransition
      {...props}
      targetNode={() => document.querySelector(`${DiscordSelectors.ThreadSidebar.chatLayerWrapper}, ${DiscordSelectors.ThreadSidebar.container}:not(${DiscordSelectors.ThreadSidebar.chatTarget})`)}
      options={{
        before: modifier('before'),
        after: modifier('after')
      }}
    />
  )
}

export default ThreadSidebarTransition
