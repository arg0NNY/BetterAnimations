import { Patcher, React } from '@/BdApi'
import { ChannelMessageList, TransitionGroup, useStateFromStores } from '@/modules/DiscordModules'
import findInReactTree from '@/helpers/findInReactTree'
import CloneTransition from '@/components/CloneTransition'
import { tempAnimationData } from '@/patches/ContextMenu/patchContextMenu'
import { clearContainingStyles } from '@/helpers/transition'
import ensureOnce from '@/helpers/ensureOnce'
import { getMessageKey } from '@/patches/ChannelMessageList/helpers'
import MessageStackStore from '@/patches/ChannelMessageList/MessageStackStore'
import anime from 'animejs'

const once = ensureOnce()

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
        const modifier = type => ({ node }) => {
          node.style.overflow = 'hidden'
          return anime({
            targets: node,
            height: type === 'after' ? 0 : [0, node.clientHeight],
            marginTop: type === 'after' ? 0 : [0, anime.get(node, 'marginTop')],
            marginBottom: type === 'after' ? 0 : [0, anime.get(node, 'marginBottom')],
            easing: 'cubicBezier(0.42, 0, 0.58, 1.0)', // easeInOut
            duration: 250,
            complete: type === 'after' ? undefined : () => ['overflow', 'height', 'margin-top', 'margin-bottom'].forEach(p => node.style.removeProperty(p))
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
                  <CloneTransition
                    key={item.key}
                    clone={false}
                    enter={toEnter.has(message ? item.key : getMessageKey(arr[index + 1]?.props?.message))}
                    exit={false}
                    animation={tempAnimationData}
                    options={{
                      before: modifier('before'),
                      after: modifier('after')
                    }}
                    onEntered={clearContainingStyles}
                  >
                    {item}
                  </CloneTransition>
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
