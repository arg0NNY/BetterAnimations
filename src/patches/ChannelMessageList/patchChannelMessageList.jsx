import { Patcher, React } from '@/BdApi'
import { ChannelMessageList, TransitionGroup, useStateFromStores } from '@/modules/DiscordModules'
import findInReactTree from '@/helpers/findInReactTree'
import AnimeTransition from '@/components/AnimeTransition'
import { tempAnimationData } from '@/patches/ContextMenu/patchContextMenu'
import { clearContainingStyles, heightModifier } from '@/helpers/transition'
import ensureOnce from '@/helpers/ensureOnce'
import { getMessageKey } from '@/patches/ChannelMessageList/helpers'
import MessageStackStore from '@/patches/ChannelMessageList/MessageStackStore'

const once = ensureOnce()

// FIXME: Doesn't work after plugin restart
// TODO: Disallow adding custom html for messages animations (and other animations with no proper wrapper)
function patchChannelMessageList () {
  Patcher.after(ChannelMessageList, 'type', (self, args, value) => {
    once(() =>
      Patcher.after(value.props.children.type, 'type', (self, args, value) => {
        const { toEnter, toExit } = useStateFromStores([MessageStackStore], () => MessageStackStore.getMessagesAwaitingTransition())

        const list = findInReactTree(value, m => m?.type === 'ol')
        if (!list) return

        const i = list.props.children.findIndex(i => Array.isArray(i))
        if (i === -1) return

        const childFactory = (e, index, arr) => {
          let message = findInReactTree(e, m => m?.message)?.message
            ?? findInReactTree(arr[index + 1] ?? {}, m => m?.message)?.message
          e.props.exit = toExit.has(message?.id)
          return e
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
                    enter={toEnter.has(message ? item.key : getMessageKey(arr[index + 1]?.props?.message))}
                    exit={false} // Managed in childFactory
                    animation={tempAnimationData}
                    context={{
                      position: 'right'
                    }}
                    options={heightModifier({ duration: 250 })}
                    onEntered={clearContainingStyles}
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
}

export default patchChannelMessageList
