import Patcher from '@/modules/Patcher'
import { CallChatSidebarKeyed, TransitionGroup, VoiceChannelViewKeyed } from '@discord/modules'
import findInReactTree, { byClassName } from '@/utils/findInReactTree'
import ensureOnce from '@utils/ensureOnce'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import Modules from '@/modules/Modules'
import DiscordClasses from '@discord/classes'
import AnimeTransition from '@components/AnimeTransition'
import { createRef, Fragment } from 'react'
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
    if (!channelView) return

    once(() => {
      injectModule(channelView.type, ModuleKey.ThreadSidebar)
      Patcher.after(ModuleKey.ThreadSidebar, channelView.type.prototype, 'render', (self, args, value) => {
        const module = Modules.getModule(ModuleKey.ThreadSidebar)
        if (!module.isEnabled()) return

        if (!self.__containerRef) self.__containerRef = createRef()

        const chatWrapper = findInReactTree(value, byClassName(DiscordClasses.VoiceChannelView.channelChatWrapper))
        if (!chatWrapper) return

        const fragment = findInReactTree(chatWrapper, m => m?.type === Fragment)
        if (!fragment) return

        const { children } = fragment.props
        const callChatSidebarIndex = 0 // Can't find dynamically because it will be unmounted if the sidebar is closed

        return (
          <ErrorBoundary module={module} fallback={value}>
            <MainWindowOnly fallback={value}>
              {() => {
                children[callChatSidebarIndex] = (
                  <TransitionGroup component={null}>
                    {
                      children[callChatSidebarIndex] &&
                      <AnimeTransition
                        injectContainerRef={true}
                        module={module}
                      >
                        {children[callChatSidebarIndex]}
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
