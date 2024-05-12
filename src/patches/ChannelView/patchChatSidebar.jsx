import { Patcher, React } from '@/BdApi'
import { ChatSidebar } from '@/modules/DiscordModules'
import findInReactTree from '@/helpers/findInReactTree'
import { AnimeContainer } from '@/components/AnimeTransition'
import Modules from '@/modules/Modules'
import ModuleKey from '@/enums/ModuleKey'
import { DiscordClasses } from '@/modules/DiscordSelectors'

function patchChatSidebar () {
  Patcher.after(ChatSidebar, 'default', (self, args, value) => {
    const module = Modules.getModule(ModuleKey.ThreadSidebar)
    if (!module.isEnabled()) return

    const chatTarget = findInReactTree(value, m => m?.props?.className?.includes(DiscordClasses.ChatSidebar.chatTarget))
    if (chatTarget) {
      chatTarget.props = {}
      chatTarget.type = React.Fragment
    }

    const chatLayerWrapper = findInReactTree(value, m => m?.className?.includes(DiscordClasses.ChatSidebar.chatLayerWrapper))
    if (chatLayerWrapper) {
      chatLayerWrapper.className += ` ${DiscordClasses.ChatSidebar.floating}`
      const container = findInReactTree(chatLayerWrapper, m => m?.className?.includes(DiscordClasses.ChatSidebar.container))
      chatLayerWrapper.style = Object.assign({ position: 'absolute' }, container?.style ?? {})
      return
    }

    return (
      <AnimeContainer container={{ className: DiscordClasses.AppView.content, style: { flex: '0 0 auto' } }}>
        <div className={DiscordClasses.AppView.content}>{value}</div>
      </AnimeContainer>
    )
  })
}

export default patchChatSidebar
