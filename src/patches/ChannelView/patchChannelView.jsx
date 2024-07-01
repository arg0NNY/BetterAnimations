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
import SwitchSidebarTransition from '@/patches/ChannelView/components/SwitchSidebarTransition'

function patchChannelView () {
  const once = ensureOnce()

  Patcher.after(ChannelView, 'type', (self, args, value) => {
    Patcher.after(value.type, 'render', (self, args, value) => {
      Patcher.after(value.props, 'children', (self, args, value) => {

        once(() => {
          injectModule(value.type, ModuleKey.MembersSidebar)
          injectModule(value.type, ModuleKey.ThreadSidebar)
          injectModule(value.type, ModuleKey.ThreadSidebarSwitch)
          Patcher.after(value.type.prototype, 'renderSidebar', (self, args, value) => {
            const module = Modules.getModule(ModuleKey.MembersSidebar)
            if (!module.isEnabled()) return value

            return (
              <SwitchTransition>
                <AnimeTransition
                  key={self.props.section}
                  container={{ className: DiscordClasses.ChannelView.content, style: { flex: '0 0 auto' } }}
                  module={module}
                >
                  {value}
                </AnimeTransition>
              </SwitchTransition>
            )
          })
          Patcher.after(value.type.prototype, 'renderThreadSidebar', (self, args, value) => {
            const module = Modules.getModule(ModuleKey.ThreadSidebar)
            const switchModule = Modules.getModule(ModuleKey.ThreadSidebarSwitch)
            if (!module.isEnabled() && !switchModule.isEnabled()) return

            const state = self.props.channelSidebarState ?? self.props.guildSidebarState
            const key = state?.type ?? 'none'

            return (
              <SwitchTransition>
                <AnimeTransition
                  key={key}
                  container={{ className: DiscordClasses.AppView.content, style: { flex: '0 0 auto' } }}
                  module={module}
                >
                  <SwitchSidebarTransition
                    state={state}
                    module={switchModule}
                  >
                    {value}
                  </SwitchSidebarTransition>
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
