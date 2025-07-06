import Patcher from '@/modules/Patcher'
import { useMessageRequestSidebarStateKeyed } from '@discord/modules'
import MessageRequestSidebarContext from '@/patches/ChannelView/context/MessageRequestSidebarContext'
import { use } from 'react'

function patchUseMessageRequestSidebarState () {
  Patcher.after(...useMessageRequestSidebarStateKeyed, (self, args, value) => {
    const sidebarState = use(MessageRequestSidebarContext)
    if (sidebarState) value.channelId = sidebarState.channelId
  })
}

export default patchUseMessageRequestSidebarState
