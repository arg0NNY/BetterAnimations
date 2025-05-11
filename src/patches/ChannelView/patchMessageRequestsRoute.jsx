import Patcher from '@/modules/Patcher'
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
import usePrevious from '@/hooks/usePrevious'
import findInReactTree from '@/utils/findInReactTree'

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

      const messageRequests = findInReactTree(value, m => typeof m?.type === 'function')
      if (!messageRequests) return

      Patcher.after(messageRequests, 'type', (self, [props], value) => {
        const state = useStateFromStores([ChannelSectionStore], () => ChannelSectionStore.getSidebarState(MESSAGE_REQUESTS_BASE_CHANNEL_ID))
        const channel = useStateFromStores([ChannelStore], () => ChannelStore.getChannel(state?.channelId), [state?.channelId])

        const cached = usePrevious({ state, channel })

        const children = value.props.children
        children[1] = (
          <AnimeTransition
            in={state && state.type === SidebarType.VIEW_MESSAGE_REQUEST && channel && channel.isPrivate()}
            container={{ className: 'BA__sidebar' }}
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
    }))
  })
}

export default patchMessageRequestsRoute
