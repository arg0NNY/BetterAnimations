import Patcher from '@/modules/Patcher'
import { useMessageRequestSidebarStateKeyed } from '@/modules/DiscordModules'
import MessageRequestSidebarContext from '@/patches/ChannelView/context/MessageRequestSidebarContext'
import { useContext } from 'react'

function patchUseMessageRequestSidebarState () {
  Patcher.after(...useMessageRequestSidebarStateKeyed, (self, args, value) => {
    const sidebarState = useContext(MessageRequestSidebarContext)
    if (sidebarState) value.channelId = sidebarState.channelId
  })
}

export default patchUseMessageRequestSidebarState
