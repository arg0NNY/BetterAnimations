import { Patcher, React } from '@/BdApi'
import { ChannelMessageList, TransitionGroup, useStateFromStores } from '@/modules/DiscordModules'
import findInReactTree from '@/helpers/findInReactTree'
import AnimeTransition from '@/components/AnimeTransition'
import { heightModifier } from '@/helpers/transition'
import ensureOnce from '@/helpers/ensureOnce'
import { getMessageKey } from '@/patches/ChannelMessageList/helpers'
import MessageStackStore from '@/patches/ChannelMessageList/MessageStackStore'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'

function patchChannelMessageList () {
  const once = ensureOnce()

  Patcher.after(ChannelMessageList, 'type', (self, args, value) => {
    once(() =>
      Patcher.after(value.props.children.type, 'type', (self, args, value) => {
        const { toEnter, toExit } = useStateFromStores([MessageStackStore], () => MessageStackStore.getMessagesAwaitingTransition())
        const module = useModule(ModuleKey.Messages)
        if (!module.isEnabled()) return

        const list = findInReactTree(value, m => m?.type === 'ol')
        if (!list) return

        const i = list.props.children.findIndex(i => Array.isArray(i))
        if (i === -1) return

        const animations = module.getAnimations()

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
                    container={true}
                    enter={toEnter.has(message ? item.key : getMessageKey(arr[index + 1]?.props?.message))}
                    exit={false} // Managed in childFactory
                    animations={animations}
                    options={heightModifier({ duration: 250 })}
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
