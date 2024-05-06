import { Patcher, React } from '@/BdApi'
import { useMessageRequestSidebarState } from '@/modules/DiscordModules'
import MessageRequestSidebarContext from '@/patches/ChannelView/context/MessageRequestSidebarContext'

function patchUseMessageRequestSidebarState () {
  Patcher.after(useMessageRequestSidebarState, 'useMessageRequestSidebarState', (self, args, value) => {
    const sidebarState = React.useContext(MessageRequestSidebarContext)
    if (sidebarState) value.channelId = sidebarState.channelId
  })
}

export default patchUseMessageRequestSidebarState
