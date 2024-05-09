import { Patcher } from '@/BdApi'
import { ChannelView } from '@/modules/DiscordModules'
import ensureOnce from '@/helpers/ensureOnce'
import AnimeTransition from '@/components/AnimeTransition'
import SwitchTransition from '@/components/SwitchTransition'
import patchVoiceChannelView from '@/patches/ChannelView/patchVoiceChannelView'
import animate from '@/patches/ChannelView/helpers/animate'
import ThreadSidebarTransition from '@/patches/ChannelView/components/ThreadSidebarTransition'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import Modules from '@/modules/Modules'

function patchChannelView () {
  const once = ensureOnce()

  Patcher.after(ChannelView, 'type', (self, args, value) => {
    Patcher.after(value.type, 'render', (self, args, value) => {
      Patcher.after(value.props, 'children', (self, args, value) => {

        once(() => {
          injectModule(value.type, ModuleKey.Sidebars)
          Patcher.after(value.type.prototype, 'renderSidebar', (self, args, value) => {
            const module = Modules.getModule(ModuleKey.Sidebars)
            if (!module.isEnabled()) return value

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
            const module = Modules.getModule(ModuleKey.Sidebars)
            if (!module.isEnabled()) return value

            return (
              <SwitchTransition>
                <ThreadSidebarTransition key={JSON.stringify(self.props.channelSidebarState ?? self.props.guildSidebarState) ?? 'none'}>
                  {value}
                </ThreadSidebarTransition>
              </SwitchTransition>
            )
          })
        })

      })
    })
  })

  patchVoiceChannelView()
}

export default patchChannelView
