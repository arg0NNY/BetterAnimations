import { Patcher, React } from '@/BdApi'
import ensureOnce from '@/utils/ensureOnce'
import {
  ChannelSectionStore,
  ChannelStore,
  MESSAGE_REQUESTS_BASE_CHANNEL_ID,
  SidebarType,
  useStateFromStores
} from '@/modules/DiscordModules'
import patchUseMessageRequestSidebarState from '@/patches/ChannelView/patchUseMessageRequestSidebarState'
import MessageRequestSidebarContext from '@/patches/ChannelView/context/MessageRequestSidebarContext'
import MessageRequestSidebarWrapper from '@/patches/ChannelView/components/MessageRequestSidebarWrapper'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import AnimeTransition from '@/components/AnimeTransition'
import SwitchSidebarTransition from '@/patches/ChannelView/components/SwitchSidebarTransition'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import usePrevious from '@/hooks/usePrevious'

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
      const switchModule = useModule(ModuleKey.ThreadSidebarSwitch)
      if (!module.isEnabled() && !switchModule.isEnabled()) return

      Patcher.after(value.props, 'children', (self, args, value) => {
        Patcher.after(value, 'type', (self, [props], value) => {
          const state = useStateFromStores([ChannelSectionStore], () => ChannelSectionStore.getSidebarState(MESSAGE_REQUESTS_BASE_CHANNEL_ID))
          const channel = useStateFromStores([ChannelStore], () => ChannelStore.getChannel(state?.channelId), [state?.channelId])

          const cached = usePrevious({ state, channel })

          const children = value.props.children
          children[1] = (
            <AnimeTransition
              in={state && state.type === SidebarType.VIEW_MESSAGE_REQUEST && channel && channel.isPrivate()}
              container={{ className: DiscordClasses.AppView.content, style: { flex: '0 0 auto' } }}
              module={module}
            >
              <SwitchSidebarTransition
                state={state ?? cached.state}
                module={switchModule}
              >
                <MessageRequestSidebarContext.Provider value={state ?? cached.state}>
                  <MessageRequestSidebarWrapper
                    pageWidth={props.width}
                    onSidebarResize={children[1]?.props?.onSidebarResize ?? (() => {})}
                    channel={channel ?? cached.channel}
                  />
                </MessageRequestSidebarContext.Provider>
              </SwitchSidebarTransition>
            </AnimeTransition>
          )
        })
      })
    }))
  })
}

export default patchMessageRequestsRoute
