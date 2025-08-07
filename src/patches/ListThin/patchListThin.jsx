import Patcher from '@/modules/Patcher'
import { Utils } from '@/BdApi'
import { ListThin, TransitionGroup, useStateFromStores } from '@discord/modules'
import findInReactTree from '@/utils/findInReactTree'
import AnimeTransition from '@components/AnimeTransition'
import ChannelStackStore from '@/patches/ListThin/ChannelStackStore'
import PassThrough from '@/components/PassThrough'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import { css } from '@style'
import DiscordSelectors from '@discord/selectors'
import { cloneElement, Fragment, useMemo, useRef } from 'react'
import patchChannelItem from '@/patches/ListThin/patchChannelItem'
import useWindow from '@/hooks/useWindow'
import { ErrorBoundary } from '@error/boundary'
import patchChannelThreadList from '@/patches/ListThin/patchChannelThreadList'

function ListItem ({ children, ...props }) {
  const itemRef = useRef()
  children.props.ref = itemRef

  const containerRef = useMemo(() => ({
    get current () {
      if (itemRef.current instanceof HTMLElement) return itemRef.current
      return Utils.findInTree(
        itemRef.current,
        m => m?.__containerRef,
        { walkable: ['decoratedRef', 'current'] }
      )?.__containerRef.current
    }
  }), [itemRef])

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
  Patcher.after(ModuleKey.ChannelList, ListThin, 'render', (self, [props], value) => {
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

    const childFactory = e => cloneElement(e, {
      exit: e.props.items.some(i => shouldAnimate(i))
    })

    focusRingScope.children = (
      <ErrorBoundary module={module} fallback={focusRingScope.children}>
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
      </ErrorBoundary>
    )
  })

  patchChannelItem()
  patchChannelThreadList()
}

export default patchListThin

css
`${DiscordSelectors.ChannelItem.containerDefault}, ${DiscordSelectors.ChannelItem.containerDragBefore},
${DiscordSelectors.ChannelItem.containerUserOver}, ${DiscordSelectors.ChannelItem.containerDragAfter} {
    transition: none;
}`
`ListThin (Channel List)`
