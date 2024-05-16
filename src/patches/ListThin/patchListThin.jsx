import { Patcher, React } from '@/BdApi'
import { ListThin, TransitionGroup, useStateFromStores } from '@/modules/DiscordModules'
import findInReactTree from '@/helpers/findInReactTree'
import AnimeTransition from '@/components/AnimeTransition'
import { heightModifier } from '@/helpers/transition'
import ChannelStackStore from '@/patches/ListThin/ChannelStackStore'
import PassThrough from '@/components/PassThrough'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import { css } from '@/modules/Style'
import { DiscordSelectors } from '@/modules/DiscordSelectors'

function patchListThin () {
  Patcher.after(ListThin, 'render', (self, [props], value) => {
    const isChannelList = props.id?.includes('channels')
    const channelsToAnimate = isChannelList && useStateFromStores([ChannelStackStore], () => ChannelStackStore.getChannelsAwaitingTransition())

    const module = useModule(ModuleKey.ChannelList)
    if (!module.isEnabled()) return

    const focusRingScope = findInReactTree(value, m => m?.containerRef)
    if (!focusRingScope || !Array.isArray(focusRingScope.children)) return

    const shouldAnimate = item => {
      if (isChannelList) {
        const { channel } = findInReactTree(item, m => m?.channel) ?? {}
        if (channel) return channelsToAnimate.channels.has(channel.id) || channelsToAnimate.guilds.has(channel.guild_id)
      }

      return false
    }

    const animations = module.getAnimations()

    const childFactory = e => {
      if (e) e.props.exit = e.props.items.some(i => shouldAnimate(i))
      return e
    }

    focusRingScope.children = (
      <TransitionGroup
        component={null}
        childFactory={childFactory}
      >
        {
          focusRingScope.children.map(item => {
            if (!item) return item

            const items = [].concat(
              item.type === React.Fragment
                ? item.props.children
                : item
            ).filter(i => !!i)

            return (
              <PassThrough
                key={item.key}
                targetContainer={e => e}
                enter={shouldAnimate(item)}
                exit={false} // Managed in childFactory
                module={module}
                animations={animations}
                options={heightModifier()}
                items={items}
              >
                {props => (
                  props.items.map(item => (
                    <AnimeTransition {...props}>
                      {item}
                    </AnimeTransition>
                  ))
                )}
              </PassThrough>
            )
          })
        }
      </TransitionGroup>
    )
  })
}

export default patchListThin

css
`${DiscordSelectors.ChannelItem.containerDefault}, ${DiscordSelectors.ChannelItem.containerDragBefore},
${DiscordSelectors.ChannelItem.containerUserOver}, ${DiscordSelectors.ChannelItem.containerDragAfter} {
    transition: none;
}`
`ListThin (Channel List)`
