import AnimeTransition from '@/components/AnimeTransition'
import animate from '@/patches/ChannelView/helpers/animate'

function ThreadSidebarTransition (props) {
  const modifier = type => context => animate(type, context)

  return (
    <AnimeTransition
      {...props}
      targetContainer={e => e}
      options={{
        before: modifier('before'),
        after: modifier('after')
      }}
    />
  )
}

export default ThreadSidebarTransition
