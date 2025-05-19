import Patcher from '@/modules/Patcher'
import { ChannelView } from '@/modules/DiscordModules'
import ensureOnce from '@/utils/ensureOnce'
import AnimeTransition from '@/components/AnimeTransition'
import SwitchTransition from '@/components/SwitchTransition'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import Modules from '@/modules/Modules'
import patchChatSidebar from '@/patches/ChannelView/patchChatSidebar'
import { DiscordSelectors } from '@/modules/DiscordSelectors'
import { css } from '@style'
import patchMembersModViewSidebar from '@/patches/ChannelView/patchMembersModViewSidebar'
import SidebarTransition from '@/patches/ChannelView/components/SidebarTransition'
import findInReactTree from '@/utils/findInReactTree'
import patchVoiceChannelView from '@/patches/ChannelView/patchVoiceChannelView'
import { MainWindowOnly } from '@/hooks/useWindow'

function patchChannelView () {
  const once = ensureOnce()

  Patcher.after(ChannelView, 'type', (self, args, value) => {
    Patcher.after(value.type, 'render', (self, args, value) => {
      const guildChannel = findInReactTree(value, m => 'guild' in (m?.props ?? {}))
      if (!guildChannel) return

      once(() => {
        injectModule(value.type, [
          ModuleKey.MembersSidebar,
          ModuleKey.ThreadSidebar,
          ModuleKey.ThreadSidebarSwitch
        ])
        Patcher.after(guildChannel.type.prototype, 'renderSidebar', (self, args, value) => {
          const module = Modules.getModule(ModuleKey.MembersSidebar)
          if (!module.isEnabled()) return value

          return (
            <MainWindowOnly fallback={value}>
              <SwitchTransition>
                <AnimeTransition
                  key={self.props.section}
                  container={{ className: 'BA__sidebar' }}
                  module={module}
                  freeze={true}
                >
                  {value}
                </AnimeTransition>
              </SwitchTransition>
            </MainWindowOnly>
          )
        })
        Patcher.after(guildChannel.type.prototype, 'renderThreadSidebar', (self, args, value) => {
          const module = Modules.getModule(ModuleKey.ThreadSidebar)
          const switchModule = Modules.getModule(ModuleKey.ThreadSidebarSwitch)
          if (!module.isEnabled() && !switchModule.isEnabled()) return

          const state = self.props.channelSidebarState ?? self.props.guildSidebarState

          return (
            <MainWindowOnly fallback={value}>
              <SidebarTransition
                module={module}
                switchModule={switchModule}
                state={state}
              >
                {value}
              </SidebarTransition>
            </MainWindowOnly>
          )
        })
      })
    })
  })

  patchChatSidebar()
  patchVoiceChannelView()
  patchMembersModViewSidebar()
}

export default patchChannelView

css
`.BA__sidebar {
    position: relative;
    display: flex;
    justify-content: flex-end;
    height: 100%;
}
${DiscordSelectors.AppView.base} {
    overflow: clip;
}
${DiscordSelectors.AppView.page} {
    overflow: visible !important;
    min-height: 0;
    min-width: 0;
}
${DiscordSelectors.ChannelView.chat} {
    overflow: clip;
    isolation: isolate;
}
${DiscordSelectors.ChatSidebar.chatLayerWrapper} {
    filter: none;
}`
`ChannelView (Sidebars)`
