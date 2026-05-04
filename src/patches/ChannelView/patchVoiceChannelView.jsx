import Patcher from '@/modules/Patcher'
import { CallChatSidebarKeyed, TransitionGroup, VoiceChannelViewKeyed } from '@discord/modules'
import findInReactTree, { byClassName } from '@/utils/findInReactTree'
import ensureOnce from '@utils/ensureOnce'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import Core from '@/modules/Core'
import AnimeTransition from '@components/AnimeTransition'
import { MainWindowOnly } from '@/hooks/useWindow'
import { ErrorBoundary } from '@error/boundary'
import cloneDeep from 'lodash-es/cloneDeep'

async function patchCallChatSidebar () {
  Patcher.after(ModuleKey.ThreadSidebar, ...await CallChatSidebarKeyed, (self, [props], value) => {
    value.props.ref = props.ref
  })
}

async function patchVoiceChannelView () {
  void patchCallChatSidebar()

  const once = ensureOnce()
  Patcher.after(ModuleKey.ThreadSidebar, ...await VoiceChannelViewKeyed, (self, args, value) => {
    const channelView = findInReactTree(value, m => m?.props?.channel)
    if (!channelView) return

    once(() => {
      injectModule(channelView.type, ModuleKey.ThreadSidebar)
      Patcher.after(ModuleKey.ThreadSidebar, channelView.type?.prototype, 'render', (self, args, originalValue) => {
        const module = Core.getModule(ModuleKey.ThreadSidebar)
        if (!module.isEnabled()) return

        const value = cloneDeep(originalValue)

        const chatWrapper = findInReactTree(value, byClassName('channelChatWrapper'))
        if (!chatWrapper) return

        return (
          <ErrorBoundary module={module} fallback={originalValue}>
            <MainWindowOnly fallback={originalValue}>
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
}

export default patchVoiceChannelView
