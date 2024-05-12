import { Patcher, React } from '@/BdApi'
import ensureOnce from '@/helpers/ensureOnce'
import {
  ChannelSectionStore,
  ChannelStore,
  MESSAGE_REQUESTS_BASE_CHANNEL_ID,
  SidebarType,
  useStateFromStores
} from '@/modules/DiscordModules'
import ThreadSidebarTransition from '@/patches/ChannelView/components/ThreadSidebarTransition'
import SwitchTransition from '@/components/SwitchTransition'
import patchUseMessageRequestSidebarState from '@/patches/ChannelView/patchUseMessageRequestSidebarState'
import MessageRequestSidebarContext from '@/patches/ChannelView/context/MessageRequestSidebarContext'
import MessageRequestSidebarWrapper from '@/patches/ChannelView/components/MessageRequestSidebarWrapper'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'

let once = () => {}

function patchMessageRequestsRoute (route) {
  if (!route) {
    // Initialization
    once = ensureOnce()
    patchUseMessageRequestSidebarState()
    return
  }

  Patcher.after(route.props, 'render', (self, args, value) => {
    once(() => Patcher.after(value.type, 'render', (self, args, value) => {
      const module = useModule(ModuleKey.ThreadSidebar)
      if (!module.isEnabled()) return

      const animations = module.getAnimations()

      Patcher.after(value.props, 'children', (self, args, value) => {
        Patcher.after(value, 'type', (self, [props], value) => {
          const state = useStateFromStores([ChannelSectionStore], () => ChannelSectionStore.getSidebarState(MESSAGE_REQUESTS_BASE_CHANNEL_ID))
          const channel = useStateFromStores([ChannelStore], () => ChannelStore.getChannel(state?.channelId))

          const children = value.props.children
          children[1] = (
            <SwitchTransition>
              <ThreadSidebarTransition key={state?.channelId ?? 'none'} animations={animations}>
                {
                  state && state.type === SidebarType.VIEW_MESSAGE_REQUEST && channel && channel.isPrivate() &&
                  <MessageRequestSidebarContext.Provider value={state}>
                    <MessageRequestSidebarWrapper
                      pageWidth={props.width}
                      onSidebarResize={children[1]?.props?.onSidebarResize ?? (() => {})}
                      channel={channel}
                    />
                  </MessageRequestSidebarContext.Provider>
                }
              </ThreadSidebarTransition>
            </SwitchTransition>
          )
        })
      })
    }))
  })
}

export default patchMessageRequestsRoute
