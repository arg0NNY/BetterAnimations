import { Patcher } from '@/BdApi'
import { ChannelView } from '@/modules/DiscordModules'
import ensureOnce from '@/helpers/ensureOnce'
import AnimeTransition from '@/components/AnimeTransition'
import SwitchTransition from '@/components/SwitchTransition'
import anime from 'animejs'
import { DiscordSelectors } from '@/modules/DiscordSelectors'

function patchChannelView () {
  const once = ensureOnce()

  Patcher.after(ChannelView, 'type', (self, args, value) => {
    Patcher.after(value.type, 'render', (self, args, value) => {
      Patcher.after(value.props, 'children', (self, args, value) => {

        once(() => {
          const animate = (type, node, width = node.clientWidth) => anime({
            targets: node,
            marginRight: type === 'after' ? -width : [-width, 0],
            easing: 'easeInOutQuint',
            duration: 400,
            complete: type === 'after' ? undefined : () => node.style.removeProperty('margin-right')
          })

          Patcher.after(value.type.prototype, 'renderSidebar', (self, args, value) => {
            const modifier = type => ({ node }) => animate(type, node)

            return (
              <SwitchTransition>
                <AnimeTransition
                  key={self.props.section}
                  options={{
                    before: modifier('before'),
                    after: modifier('after')
                  }}
                >
                  {value}
                </AnimeTransition>
              </SwitchTransition>
            )
          })
          Patcher.after(value.type.prototype, 'renderThreadSidebar', (self, args, value) => {
            const modifier = type => ({ node }) => {
              let width = node.classList.contains(DiscordSelectors.ThreadSidebar.chatLayerWrapper.slice(1))
                ? node.querySelector(`${DiscordSelectors.ThreadSidebar.container}:not(${DiscordSelectors.ThreadSidebar.chatTarget})`)?.clientWidth
                : node.clientWidth + 8

              return animate(type, node, width)
            }

            return (
              <SwitchTransition>
                <AnimeTransition
                  key={self.props.section + JSON.stringify(self.props.channelSidebarState)}
                  targetNode={() => document.querySelector(`${DiscordSelectors.ThreadSidebar.chatLayerWrapper}, ${DiscordSelectors.ThreadSidebar.container}:not(${DiscordSelectors.ThreadSidebar.chatTarget})`)}
                  options={{
                    before: modifier('before'),
                    after: modifier('after')
                  }}
                >
                  {value}
                </AnimeTransition>
              </SwitchTransition>
            )
          })
        })

      })
    })
  })
}

export default patchChannelView
