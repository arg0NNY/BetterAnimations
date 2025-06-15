import Patcher from '@/modules/Patcher'
import { ChannelMessageList, TransitionGroup, useStateFromStores } from '@discord/modules'
import findInReactTree from '@/utils/findInReactTree'
import AnimeTransition from '@components/AnimeTransition'
import ensureOnce from '@utils/ensureOnce'
import { getMessageKey } from '@/patches/ChannelMessageList/utils'
import MessageStackStore from '@/patches/ChannelMessageList/MessageStackStore'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import patchMessage from '@/patches/ChannelMessageList/patchMessage'
import patchMessageDivider from '@/patches/ChannelMessageList/patchMessageDivider'
import { css } from '@style'
import DiscordSelectors from '@discord/selectors'
import useWindow from '@/hooks/useWindow'
import { cloneElement } from 'react'

function patchChannelMessageList () {
  const once = ensureOnce()

  Patcher.after(ChannelMessageList, 'type', (self, args, value) => {
    once(() =>
      Patcher.after(findInReactTree(value.props.children, m => m?.props?.messages).type, 'type', (self, args, value) => {
        const { toEnter, toExit } = useStateFromStores([MessageStackStore], () => MessageStackStore.getMessagesAwaitingTransition())
        const { isMainWindow } = useWindow()
        const module = useModule(ModuleKey.Messages)
        if (!isMainWindow || !module.isEnabled()) return

        const list = findInReactTree(value, m => m?.type === 'ol')
        if (!list) return

        const i = list.props.children.findIndex(i => Array.isArray(i))
        if (i === -1) return

        const childFactory = (e, index, arr) => {
          const message = findInReactTree(e, m => m?.message)?.message
            ?? findInReactTree(arr[index + 1] ?? {}, m => m?.message)?.message
          return cloneElement(e, {
            exit: toExit.has(message?.id)
          })
        }

        list.props.children[i] = (
          <TransitionGroup
            component={null}
            childFactory={childFactory}
          >
            {
              list.props.children[i].map((item, index, arr) => {
                const { message } = item.props
                if (message) item.key = getMessageKey(message)

                return (
                  <AnimeTransition
                    key={item.key}
                    injectContainerRef={true}
                    enter={toEnter.has(message ? item.key : getMessageKey(arr[index + 1]?.props?.message))}
                    exit={false} // Managed in childFactory
                    module={module}
                  >
                    {item}
                  </AnimeTransition>
                )
              })
            }
          </TransitionGroup>
        )
      })
    )
  })

  patchMessage()
  patchMessageDivider()
}

export default patchChannelMessageList

css
`${DiscordSelectors.MessageList.divider} {
    position: relative;
}`
`ChannelMessageList (Messages)`
