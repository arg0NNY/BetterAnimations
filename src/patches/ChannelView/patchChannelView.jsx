import { Patcher } from '@/BdApi'
import { ChannelView } from '@/modules/DiscordModules'
import ensureOnce from '@/helpers/ensureOnce'
import AnimeTransition from '@/components/AnimeTransition'
import SwitchTransition from '@/components/SwitchTransition'
import patchVoiceChannelView from '@/patches/ChannelView/patchVoiceChannelView'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import Modules from '@/modules/Modules'
import patchChatSidebar from '@/patches/ChannelView/patchChatSidebar'
import { DiscordClasses, DiscordSelectors } from '@/modules/DiscordSelectors'
import { css } from '@/modules/Style'

function patchChannelView () {
  const once = ensureOnce()

  Patcher.after(ChannelView, 'type', (self, args, value) => {
    Patcher.after(value.type, 'render', (self, args, value) => {
      Patcher.after(value.props, 'children', (self, args, value) => {

        once(() => {
          injectModule(value.type, ModuleKey.MembersSidebar)
          injectModule(value.type, ModuleKey.ThreadSidebar)
          Patcher.after(value.type.prototype, 'renderSidebar', (self, args, value) => {
            const module = Modules.getModule(ModuleKey.MembersSidebar)
            if (!module.isEnabled()) return value

            return (
              <SwitchTransition>
                <AnimeTransition
                  key={self.props.section}
                  container={{ className: DiscordClasses.ChannelView.content, style: { flex: '0 0 auto' } }}
                  module={module}
                  animations={module.getAnimations()}
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
                <AnimeTransition
                  key={JSON.stringify(self.props.channelSidebarState ?? self.props.guildSidebarState) ?? 'none'}
                  targetContainer={e => e}
                  module={module}
                  animations={module.getAnimations()}
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

  patchChatSidebar()
  patchVoiceChannelView()
}

export default patchChannelView

css
`${DiscordSelectors.ChannelView.chat} {
    overflow: clip;
    isolation: isolate;
}
${DiscordSelectors.ChatSidebar.chatLayerWrapper} {
    filter: none;
}`
`ChannelView (Sidebars)`
