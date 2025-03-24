import {
  ChatSidebar as _ChatSidebar,
  ChatSidebarType,
  Constants,
  mangled,
  MESSAGE_REQUESTS_BASE_CHANNEL_ID,
  MessageRequestSidebar
} from '@/modules/DiscordModules'
import { memo } from 'react'

function MessageRequestSidebarWrapper ({ pageWidth, onSidebarResize, channel }) {
  const ChatSidebar = mangled(_ChatSidebar)

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
}

export default memo(MessageRequestSidebarWrapper)
