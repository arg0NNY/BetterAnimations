import {
  ChatSidebarKeyed as _ChatSidebar,
  ChatSidebarType,
  Constants,
  MESSAGE_REQUESTS_BASE_CHANNEL_ID,
  MessageRequestSidebar
} from '@discord/modules'
import { memo } from 'react'
import { unkeyed } from '@/utils/webpack'
import MessageRequestSidebarContext from '@/patches/ChannelView/context/MessageRequestSidebarContext'

function MessageRequestSidebarWrapper ({ state, pageWidth, onSidebarResize, channel, ref }) {
  const ChatSidebar = unkeyed(_ChatSidebar)

  return (
    <MessageRequestSidebarContext value={state}>
      <ChatSidebar
        ref={ref}
        sidebarType={ChatSidebarType.MessageRequestSidebar}
        maxWidth={pageWidth - Constants.DEFAULT_MESSAGE_REQUEST_SIDEBAR_WIDTH}
        onWidthChange={onSidebarResize}
      >
        <MessageRequestSidebar
          channel={channel}
          baseChannelId={MESSAGE_REQUESTS_BASE_CHANNEL_ID}
        />
      </ChatSidebar>
    </MessageRequestSidebarContext>
  )
}

export default memo(MessageRequestSidebarWrapper)
