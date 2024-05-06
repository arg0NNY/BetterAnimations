import { React } from '@/BdApi'
import {
  ChatSidebar,
  ChatSidebarType,
  Constants,
  MESSAGE_REQUESTS_BASE_CHANNEL_ID,
  MessageRequestSidebar
} from '@/modules/DiscordModules'

const MessageRequestSidebarWrapper = React.memo(function MessageRequestSidebarWrapper ({ pageWidth, onSidebarResize, channel }) {
  return (
    <ChatSidebar
      sidebarType={ChatSidebarType.MessageRequestSidebar}
      maxWidth={pageWidth - Constants.DEFAULT_MESSAGE_REQUEST_SIDEBAR_WIDTH}
      onWidthChange={onSidebarResize}
    >
      <MessageRequestSidebar
        channel={channel}
        baseChannelId={MESSAGE_REQUESTS_BASE_CHANNEL_ID}
      />
    </ChatSidebar>
  )
})

export default MessageRequestSidebarWrapper
