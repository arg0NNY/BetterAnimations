import Patcher from '@/modules/Patcher'
import { ChatSidebarKeyed } from '@discord/modules'
import findInReactTree, { byClassName } from '@/utils/findInReactTree'
import AnimeContainer from '@components/AnimeContainer'
import ModuleKey from '@enums/ModuleKey'
import DiscordClasses from '@discord/classes'
import { Fragment } from 'react'
import useModule from '@/hooks/useModule'
import useWindow from '@/hooks/useWindow'
import { ErrorBoundary } from '@error/boundary'

function patchChatSidebar () {
  Patcher.instead(...ChatSidebarKeyed, (self, [props], original) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.ThreadSidebar)
    const switchModule = useModule(ModuleKey.ThreadSidebarSwitch)
    if (!isMainWindow || (!module.isEnabled() && !switchModule.isEnabled())) return original(props)

    const value = original({
      ...props,
      maxWidth: Math.max(props.maxWidth, 451),
      floatingLayer: null
    })

    const chatTarget = findInReactTree(value, byClassName(DiscordClasses.ChatSidebar.chatTarget))
    if (chatTarget) {
      chatTarget.props = {}
      chatTarget.type = Fragment
    }

    return (
      <ErrorBoundary fallback={<original {...props} />}>
        <AnimeContainer ref={props.ref} container={{ className: 'BA__sidebar' }}>
          <div className="BA__sidebar">{value}</div>
        </AnimeContainer>
      </ErrorBoundary>
    )
  })
}

export default patchChatSidebar
