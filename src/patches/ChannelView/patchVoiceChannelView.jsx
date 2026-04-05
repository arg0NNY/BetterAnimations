import Patcher from '@/modules/Patcher'
import { CallChatSidebarKeyed, TransitionGroup, VoiceChannelViewKeyed } from '@discord/modules'
import findInReactTree, { byClassName } from '@/utils/findInReactTree'
import ensureOnce from '@utils/ensureOnce'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import Core from '@/modules/Core'
import DiscordClasses from '@discord/classes'
import AnimeTransition from '@components/AnimeTransition'
import { MainWindowOnly } from '@/hooks/useWindow'
import { ErrorBoundary } from '@error/boundary'

function patchCallChatSidebar () {
  Patcher.after(ModuleKey.ThreadSidebar, ...CallChatSidebarKeyed, (self, [props], value) => {
    value.props.ref = props.ref
  })
}

function patchVoiceChannelView () {
  const once = ensureOnce()

  Patcher.after(ModuleKey.ThreadSidebar, ...VoiceChannelViewKeyed, (self, args, value) => {
    const channelView = findInReactTree(value, m => m?.props?.channel)
    // console.log(value, channelView)
    if (!channelView) return

    once(() => {
      injectModule(channelView.type, ModuleKey.ThreadSidebar)
      Patcher.after(ModuleKey.ThreadSidebar, channelView.type?.prototype, 'render', (self, args, value) => {
        const module = Core.getModule(ModuleKey.ThreadSidebar)
        if (!module.isEnabled()) return

        const chatWrapper = findInReactTree(value, byClassName(DiscordClasses.VoiceChannelView.channelChatWrapper))
        if (!chatWrapper) return

        return (
          <ErrorBoundary module={module} fallback={value}>
            <MainWindowOnly fallback={value}>
              {() => {
                chatWrapper.props.children = (
                  <TransitionGroup component={null}>
                    {
                      chatWrapper.props.children &&
                      <AnimeTransition
                        injectContainerRef={true}
                        module={module}
                      >
                        {chatWrapper.props.children}
                      </AnimeTransition>
                    }
                  </TransitionGroup>
                )
                return value
              }}
            </MainWindowOnly>
          </ErrorBoundary>
        )
      })
    })
  })

  patchCallChatSidebar()
}

export default patchVoiceChannelView
