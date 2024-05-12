import { Patcher } from '@/BdApi'
import { TransitionGroup, VoiceChannelView } from '@/modules/DiscordModules'
import findInReactTree from '@/helpers/findInReactTree'
import ensureOnce from '@/helpers/ensureOnce'
import ThreadSidebarTransition from '@/patches/ChannelView/components/ThreadSidebarTransition'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import Modules from '@/modules/Modules'

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

        const chatWrapper = findInReactTree(value, m => m?.className?.includes('channelChatWrapper'))
        if (!chatWrapper) return

        chatWrapper.children = (
          <TransitionGroup component={null}>
            {
              chatWrapper.children &&
              <ThreadSidebarTransition animations={module.getAnimations()}>
                {chatWrapper.children}
              </ThreadSidebarTransition>
            }
          </TransitionGroup>
        )
      })
    })
  })
}

export default patchVoiceChannelView
