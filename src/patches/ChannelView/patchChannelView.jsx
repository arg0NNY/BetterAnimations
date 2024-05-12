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
import patchChatSidebar from '@/patches/ChannelView/patchChatSidebar'
import { DiscordClasses } from '@/modules/DiscordSelectors'

function patchChannelView () {
  const once = ensureOnce()

  Patcher.after(ChannelView, 'type', (self, args, value) => {
    Patcher.after(value.type, 'render', (self, args, value) => {
      Patcher.after(value.props, 'children', (self, args, value) => {

        once(() => {
          injectModule(value.type, ModuleKey.MembersSidebar)
          injectModule(value.type, ModuleKey.ThreadSidebar) // TODO: Won't clear the second module on unmount because of how injectModule made, fix that
          Patcher.after(value.type.prototype, 'renderSidebar', (self, args, value) => {
            const module = Modules.getModule(ModuleKey.MembersSidebar)
            if (!module.isEnabled()) return value

            const modifier = type => ({ container }) => animate(type, container)

            return (
              <SwitchTransition>
                <AnimeTransition
                  key={self.props.section}
                  container={{ className: DiscordClasses.ChannelView.content, style: { flex: '0 0 auto' } }}
                  animations={module.getAnimations()}
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
            const module = Modules.getModule(ModuleKey.ThreadSidebar)
            if (!module.isEnabled()) return value

            return (
              <SwitchTransition>
                <ThreadSidebarTransition
                  key={JSON.stringify(self.props.channelSidebarState ?? self.props.guildSidebarState) ?? 'none'}
                  animations={module.getAnimations()}
                >
                  {value}
                </ThreadSidebarTransition>
              </SwitchTransition>
            )
          })
        })

      })
    })
  })

  patchChatSidebar()
  patchVoiceChannelView()
}

export default patchChannelView
