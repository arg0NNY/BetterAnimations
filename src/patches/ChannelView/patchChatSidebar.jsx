import { Patcher, React } from '@/BdApi'
import { ChatSidebar } from '@/modules/DiscordModules'
import findInReactTree from '@/helpers/findInReactTree'
import { AnimeContainer } from '@/components/AnimeTransition'
import Modules from '@/modules/Modules'
import ModuleKey from '@/enums/ModuleKey'

function patchChatSidebar () {
  Patcher.after(ChatSidebar, 'default', (self, args, value) => {
    const module = Modules.getModule(ModuleKey.ThreadSidebar)
    if (!module.isEnabled()) return

    const chatTarget = findInReactTree(value, m => m?.props?.className?.includes('chatTarget'))
    if (chatTarget) {
      chatTarget.props = {}
      chatTarget.type = React.Fragment
    }

    const chatLayerWrapper = findInReactTree(value, m => m?.className?.includes('chatLayerWrapper'))
    if (chatLayerWrapper) {
      chatLayerWrapper.className += ' floating__8f631'
      const container = findInReactTree(chatLayerWrapper, m => m?.className?.includes('container__694a1'))
      chatLayerWrapper.style = Object.assign({ position: 'absolute' }, container?.style ?? {})
      return
    }

    return (
      <AnimeContainer container={{ className: 'content__76dcf', style: { flex: '0 0 auto' } }}>
        <div className="content__76dcf">{value}</div>
      </AnimeContainer>
    )
  })
}

export default patchChatSidebar
