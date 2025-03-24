import { Patcher } from '@/BdApi'
import { useMessageRequestSidebarState } from '@/modules/DiscordModules'
import MessageRequestSidebarContext from '@/patches/ChannelView/context/MessageRequestSidebarContext'
import { useContext } from 'react'

function patchUseMessageRequestSidebarState () {
  Patcher.after(...useMessageRequestSidebarState, (self, args, value) => {
    const sidebarState = useContext(MessageRequestSidebarContext)
    if (sidebarState) value.channelId = sidebarState.channelId
  })
}

export default patchUseMessageRequestSidebarState
