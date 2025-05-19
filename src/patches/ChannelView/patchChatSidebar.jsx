import Patcher from '@/modules/Patcher'
import { ChatSidebarKeyed } from '@/modules/DiscordModules'
import findInReactTree from '@/utils/findInReactTree'
import AnimeContainer from '@/components/AnimeContainer'
import ModuleKey from '@enums/ModuleKey'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import { Fragment } from 'react'
import useModule from '@/hooks/useModule'
import useWindow from '@/hooks/useWindow'

function patchChatSidebar () {
  Patcher.instead(...ChatSidebarKeyed, (self, [props], original) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.ThreadSidebar)
    const switchModule = useModule(ModuleKey.ThreadSidebarSwitch)
    if (!isMainWindow || (!module.isEnabled() && !switchModule.isEnabled())) return original(props)

    props.maxWidth = Math.max(props.maxWidth, 451) // Disable floating state
    delete props.floatingLayer // Disable teleport to layer container in a voice call

    const value = original(props)

    const chatTarget = findInReactTree(value, m => m?.props?.className?.includes(DiscordClasses.ChatSidebar.chatTarget))
    if (chatTarget) {
      chatTarget.props = {}
      chatTarget.type = Fragment
    }

    return (
      <AnimeContainer ref={props.ref} container={{ className: 'BA__sidebar' }}>
        <div className="BA__sidebar">{value}</div>
      </AnimeContainer>
    )
  })
}

export default patchChatSidebar
