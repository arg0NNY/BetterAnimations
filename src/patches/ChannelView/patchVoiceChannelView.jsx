import { Patcher } from '@/BdApi'
import { TransitionGroup, VoiceChannelView } from '@/modules/DiscordModules'
import findInReactTree from '@/helpers/findInReactTree'
import ensureOnce from '@/helpers/ensureOnce'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import Modules from '@/modules/Modules'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import AnimeTransition from '@/components/AnimeTransition'

function patchVoiceChannelView () {
  const once = ensureOnce()

  Patcher.after(VoiceChannelView, 'default', (self, args, value) => {
    const channelView = findInReactTree(value, m => m?.props?.channel)
    if (!channelView) return

    once(() => {
      injectModule(channelView.type, ModuleKey.ThreadSidebar)
      Patcher.after(channelView.type.prototype, 'render', (self, args, value) => {
        const module = Modules.getModule(ModuleKey.ThreadSidebar)
        if (!module.isEnabled()) return value

        const chatWrapper = findInReactTree(value, m => m?.className?.includes(DiscordClasses.VoiceChannelView.channelChatWrapper))
        if (!chatWrapper) return

        chatWrapper.children = (
          <TransitionGroup component={null}>
            {
              chatWrapper.children &&
              <AnimeTransition
                targetContainer={e => e}
                module={module}
              >
                {chatWrapper.children}
              </AnimeTransition>
            }
          </TransitionGroup>
        )
      })
    })
  })
}

export default patchVoiceChannelView
