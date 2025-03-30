import { Patcher } from '@/BdApi'
import { ChatSidebar } from '@/modules/DiscordModules'
import findInReactTree from '@/utils/findInReactTree'
import AnimeContainer from '@/components/AnimeContainer'
import ModuleKey from '@/enums/ModuleKey'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import { Fragment } from 'react'
import useModule from '@/hooks/useModule'
import Modules from '@/modules/Modules'

function patchChatSidebar () {
  Patcher.before(...ChatSidebar, (self, [props]) => {
    const module = useModule(ModuleKey.ThreadSidebar)
    const switchModule = useModule(ModuleKey.ThreadSidebarSwitch)
    if (!module.isEnabled() && !switchModule.isEnabled()) return

    props.maxWidth = Math.max(props.maxWidth, 451) // Disable floating state
  })
  Patcher.after(...ChatSidebar, (self, args, value) => {
    const module = Modules.getModule(ModuleKey.ThreadSidebar)
    const switchModule = Modules.getModule(ModuleKey.ThreadSidebarSwitch)
    if (!module.isEnabled() && !switchModule.isEnabled()) return

    const chatTarget = findInReactTree(value, m => m?.props?.className?.includes(DiscordClasses.ChatSidebar.chatTarget))
    if (chatTarget) {
      chatTarget.props = {}
      chatTarget.type = Fragment
    }

    return (
      <AnimeContainer container={{ className: 'BA__sidebar' }}>
        <div className="BA__sidebar">{value}</div>
      </AnimeContainer>
    )
  })
}

export default patchChatSidebar
