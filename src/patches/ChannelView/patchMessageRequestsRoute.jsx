import Patcher from '@/modules/Patcher'
import ensureOnce from '@utils/ensureOnce'
import {
  ChannelSectionStore,
  ChannelStore,
  MESSAGE_REQUESTS_BASE_CHANNEL_ID,
  SidebarType,
  TransitionGroup,
  useStateFromStores
} from '@discord/modules'
import patchUseMessageRequestSidebarState from '@/patches/ChannelView/patchUseMessageRequestSidebarState'
import MessageRequestSidebarWrapper from '@/patches/ChannelView/components/MessageRequestSidebarWrapper'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import AnimeTransition from '@components/AnimeTransition'
import usePrevious from '@/hooks/usePrevious'
import findInReactTree from '@/utils/findInReactTree'
import useWindow from '@/hooks/useWindow'
import { ErrorBoundary } from '@error/boundary'

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
      const { isMainWindow } = useWindow()
      const module = useModule(ModuleKey.ThreadSidebar)
      const switchModule = useModule(ModuleKey.ThreadSidebarSwitch)
      if (!isMainWindow || (!module.isEnabled() && !switchModule.isEnabled())) return

      const messageRequests = findInReactTree(value, m => typeof m?.type === 'function')
      if (!messageRequests) return

      Patcher.after(messageRequests, 'type', (self, [props], value) => {
        const state = useStateFromStores([ChannelSectionStore], () => ChannelSectionStore.getSidebarState(MESSAGE_REQUESTS_BASE_CHANNEL_ID))
        const channel = useStateFromStores([ChannelStore], () => ChannelStore.getChannel(state?.channelId), [state?.channelId])

        const cached = usePrevious({ state, channel })

        const children = value.props.children
        children[1] = (
          <ErrorBoundary fallback={children[1]}>
            <AnimeTransition
              in={state && state.type === SidebarType.VIEW_MESSAGE_REQUEST && channel && channel.isPrivate()}
              container={{ className: 'BA__sidebar' }}
              module={module}
            >
              <TransitionGroup component={null}>
                <AnimeTransition
                  key={JSON.stringify(state ?? cached.state)}
                  injectContainerRef={true}
                  module={switchModule}
                >
                  <MessageRequestSidebarWrapper
                    state={state ?? cached.state}
                    pageWidth={props.width}
                    onSidebarResize={children[1]?.props?.onSidebarResize ?? (() => {})}
                    channel={channel ?? cached.channel}
                  />
                </AnimeTransition>
              </TransitionGroup>
            </AnimeTransition>
          </ErrorBoundary>
        )
      })
    }))
  })
}

export default patchMessageRequestsRoute
