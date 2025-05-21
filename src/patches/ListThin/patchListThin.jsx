import { Patcher, Utils } from '@/BdApi'
import { ListThin, TransitionGroup, useStateFromStores } from '@discord/modules'
import findInReactTree from '@/utils/findInReactTree'
import AnimeTransition from '@components/AnimeTransition'
import ChannelStackStore from '@/patches/ListThin/ChannelStackStore'
import PassThrough from '@/components/PassThrough'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import { css } from '@style'
import { DiscordSelectors } from '@/modules/DiscordSelectors'
import { Fragment, useMemo, useRef } from 'react'
import patchChannelItem from '@/patches/ListThin/patchChannelItem'
import useWindow from '@/hooks/useWindow'

function ListItem ({ children, ...props }) {
  const draggableRef = useRef()
  children.props.ref = draggableRef

  const containerRef = useMemo(() => ({
    get current () {
      return Utils.findInTree(
        draggableRef.current,
        m => m?.__containerRef,
        { walkable: ['decoratedRef', 'current'] }
      )?.__containerRef.current
    }
  }), [draggableRef])

  return (
    <AnimeTransition
      containerRef={containerRef}
      {...props}
    >
      {children}
    </AnimeTransition>
  )
}

function patchListThin () {
  Patcher.after(ListThin, 'render', (self, [props], value) => {
    const isChannelList = props.id?.includes('channels')
    const channelsToAnimate = isChannelList && useStateFromStores([ChannelStackStore], () => ChannelStackStore.getChannelsAwaitingTransition())

    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.ChannelList)
    if (!isMainWindow || !isChannelList || !module.isEnabled()) return

    const focusRingScope = findInReactTree(value, m => m?.containerRef)
    if (!focusRingScope || !Array.isArray(focusRingScope.children)) return

    const shouldAnimate = item => {
      if (isChannelList) {
        const { channel } = findInReactTree(item, m => m?.channel) ?? {}
        if (channel) return channelsToAnimate.channels.has(channel.id) || channelsToAnimate.guilds.has(channel.guild_id)
      }

      return false
    }

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
              item.type === Fragment
                ? item.props.children
                : item
            ).filter(i => !!i)

            return (
              <PassThrough
                key={item.key}
                enter={shouldAnimate(item)}
                exit={false} // Managed in childFactory
                module={module}
                items={items}
              >
                {props => (
                  props.items.map(item => (
                    <ListItem {...props}>
                      {item}
                    </ListItem>
                  ))
                )}
              </PassThrough>
            )
          })
        }
      </TransitionGroup>
    )
  })

  patchChannelItem()
}

export default patchListThin

css
`${DiscordSelectors.ChannelItem.containerDefault}, ${DiscordSelectors.ChannelItem.containerDragBefore},
${DiscordSelectors.ChannelItem.containerUserOver}, ${DiscordSelectors.ChannelItem.containerDragAfter} {
    transition: none;
}`
`ListThin (Channel List)`
