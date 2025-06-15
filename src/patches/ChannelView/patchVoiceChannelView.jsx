import Patcher from '@/modules/Patcher'
import { CallChatSidebarKeyed, TransitionGroup, VoiceChannelViewKeyed } from '@discord/modules'
import findInReactTree from '@/utils/findInReactTree'
import ensureOnce from '@utils/ensureOnce'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import Modules from '@/modules/Modules'
import DiscordClasses from '@discord/classes'
import AnimeTransition from '@components/AnimeTransition'
import { createRef, Fragment } from 'react'
import { MainWindowOnly } from '@/hooks/useWindow'

function patchCallChatSidebar () {
  Patcher.after(...CallChatSidebarKeyed, (self, [props], value) => {
    value.props.ref = props.ref
  })
}

function patchVoiceChannelView () {
  const once = ensureOnce()

  Patcher.after(...VoiceChannelViewKeyed, (self, args, value) => {
    const channelView = findInReactTree(value, m => m?.props?.channel)
    if (!channelView) return

    once(() => {
      injectModule(channelView.type, ModuleKey.ThreadSidebar)
      Patcher.after(channelView.type.prototype, 'render', (self, args, value) => {
        const module = Modules.getModule(ModuleKey.ThreadSidebar)
        if (!module.isEnabled()) return

        if (!self.__containerRef) self.__containerRef = createRef()

        const chatWrapper = findInReactTree(value, m => m?.className?.includes(DiscordClasses.VoiceChannelView.channelChatWrapper))
        if (!chatWrapper) return

        const fragment = findInReactTree(chatWrapper, m => m?.type === Fragment)
        if (!fragment) return

        const { children } = fragment.props
        const callChatSidebarIndex = 0 // Can't find dynamically because it will be unmounted if the sidebar is closed

        return (
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
        )
      })
    })
  })

  patchCallChatSidebar()
}

export default patchVoiceChannelView
