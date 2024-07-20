import { React, Webpack } from '@/BdApi'

const { Filters } = Webpack

/* ======== HELPER FUNCTIONS ======== */

function avoidCommon (module) {
  return module === null || typeof module !== 'object' || Object.keys(module).length <= 100
}

function mapModule (module, gettersMap, options = {}) {
  const { withKeys = false, avoidCommon: _avoidCommon = true } = options

  if (typeof module === 'function')
    module = Webpack.getModule(m => Object.values(m).some(module) && (!_avoidCommon || avoidCommon(m)))

  return module && Object.fromEntries(
    Object.entries(gettersMap)
      .map(([key, getter]) => {
        try {
          if (withKeys) return [key, [...Webpack.getWithKey(getter, { target: module })]]
          return [key, Object.values(module).find(getter)]
        }
        catch (err) {
          console.warn(`Failed to map the given module with key ${key}:`, err)
          return [key, undefined]
        }
      })
  )
}

function getMangled (filter, options = {}) {
  const { avoidCommon: _avoidCommon = true, lazy = false, ...rest } = options
  const predicate = m => Object.values(m).some(e => filter(e, m)) && (!_avoidCommon || avoidCommon(m))
  const findKey = module => module && Object.keys(module).find(k => filter(module[k], module))

  if (lazy) return new Promise(async resolve => {
    const module = await Webpack.waitForModule(predicate, rest)
    resolve([module, findKey(module)])
  })

  const module = Webpack.getModule(predicate, rest)
  return [module, findKey(module)]
}
export function mangled (mangled) {
  return mangled[0][mangled[1]]
}


/* ======== MODULES ======== */

export const Common = Webpack.getByKeys('Button', 'ButtonSizes', 'Clickable', 'Dialog')
export const {
  Tooltip,
  TooltipLayer,
  Backdrop: ModalBackdrop,
  List: ListThin
} = Common
export const LocaleStore = Webpack.getModule(m => m.Messages?.IMAGE)
export const Dispatcher = Webpack.getByKeys('dispatch', 'subscribe')
export const AppView = getMangled(Filters.byStrings('CHANNEL_THREAD_VIEW', 'GUILD_DISCOVERY'))
export const Router = Object.assign(
  mapModule(m => m?.computeRootMatch, {
    Router: m => m?.computeRootMatch,
    Route: m => Filters.byStrings('props.computedMatch', 'props.path')(m?.prototype?.render),
    Switch: m => Filters.byStrings('props.location', 'cloneElement')(m?.prototype?.render),
    matchPath: Filters.byStrings('strict', 'isExact'),
    useLocation: Filters.byRegex(/return \w+\(\w+\)\.location/),
    useParams: Filters.byStrings('.match', '.params')
  }),
  {
    Link: Webpack.getModule(m => Filters.byStrings('createHref', 'navigate')(m?.render), { searchExports: true })
  }
)
export const Transition = Webpack.getByKeys('ENTERING', 'EXITING', 'contextType')
export const CSSTransition = Webpack.getModule(m => m?.defaultProps?.classNames === '')
export const TransitionGroup = Webpack.getModule(m => Filters.byPrototypeKeys('handleExited')(m) && !m.childContextTypes, { searchExports: true })
export const TransitionGroupContext = new Transition({ children: React.createElement('div') }, {}).render().type._context
export const Routes = Webpack.getModule(Filters.byKeys('CHANNEL_THREAD_VIEW', 'GUILD_DISCOVERY'), { searchExports: true })
export const Constants = {
  DEFAULT_MESSAGE_REQUEST_SIDEBAR_WIDTH: 650,
  Routes,
  Themes: Webpack.getByKeys('DARK', 'LIGHT')
}
export const StaticChannelRoute = Webpack.getModule(Filters.byKeys('ROLE_SUBSCRIPTIONS', 'CHANNEL_BROWSER'), { searchExports: true })
export const ContextMenu = getMangled(Filters.byStrings('getContextMenu', 'isOpen'))
export const Flux = Webpack.getByKeys('Store', 'connectStores')
export const useStateFromStores = Webpack.getModule(Filters.byStrings('useStateFromStores'), { searchExports: true })
export const MenuSubmenuItem = getMangled(Filters.byStrings('subMenuClassName', 'submenuPaddingContainer'))
export const MenuSubmenuListItem = getMangled(Filters.byStrings('menuSubmenuProps', 'listClassName', 'submenuPaddingContainer'))
export const { updateTheme } = Webpack.getByKeys('updateTheme')
export const ThemeStore = Webpack.getStore('ThemeStore')
export const BasePopout = getMangled(m => m?.defaultProps?.loadingComponent)
export const PopoutCSSAnimator = getMangled(m => Filters.byKeys('TRANSLATE', 'SCALE')(m?.Types))
export const SpringTransitionPhases = Webpack.getModule(Filters.byKeys('ENTER', 'LEAVE'), { searchExports: true })
export const { Layer, appLayerContext } = mapModule(Filters.byDisplayName('AppLayer'), {
  Layer: Filters.byDisplayName('AppLayer'),
  appLayerContext: m => m?.Provider
})
export const ChannelMessageList = Webpack.getModule(m => Filters.byStrings('channel', 'messageDisplayCompact')(m?.type))
export const ChannelView = Webpack.getModule(m => Filters.byStrings('providedChannel')(m?.type))
export const PropTypes = Webpack.getByKeys('PropTypes')
export const StandardSidebarViewWrapper = Webpack.waitForModule(Filters.byPrototypeKeys('getPredicateSections', 'renderSidebar'))
export const StandardSidebarView = getMangled(Filters.byStrings('standardSidebarView', 'section'), { lazy: true })
export const Modals = getMangled(Filters.byStrings('Backdrop', 'modalKey'))
export const Layers = getMangled(Filters.byStrings('hasFullScreenLayer'))
export const ChannelStore = Webpack.getStore('ChannelStore')
export const VoiceChannelView = getMangled(Filters.byStrings('shouldUseVoiceEffectsActionBar'))
export const { Easing } = Webpack.getByKeys('Easing')
export const SortedGuildStore = Webpack.getStore('SortedGuildStore')
export const { GuildChannelList } = mapModule(Filters.byStrings('favorites-channel-list'), { GuildChannelList: Filters.byStrings('getGuild', 'guildId') }, { withKeys: true })
export const ChannelListCommunityRow = Webpack.getModule(Filters.byKeys('GUILD_ROLE_SUBSCRIPTIONS', 'CHANNELS_AND_ROLES'), { searchExports: true })
export const PrivateChannelSortStore = Webpack.getStore('PrivateChannelSortStore')
export const { ChannelSectionStore, MESSAGE_REQUESTS_BASE_CHANNEL_ID } = mapModule(Filters.byStoreName('ChannelSectionStore'), {
  ChannelSectionStore: Filters.byStoreName('ChannelSectionStore'),
  MESSAGE_REQUESTS_BASE_CHANNEL_ID: m => typeof m === 'string'
})
export const ChatSidebar = getMangled(Filters.byStrings('sidebarType', 'postSidebarWidth'))
export const ChatSidebarType = Webpack.getModule(Filters.byKeys('MessageRequestSidebar', 'ThreadSidebar'), { searchExports: true })
export const MessageRequestSidebar = Webpack.getByStrings('isMessageRequest', 'closeChannelSidebar')
export const SidebarType = Webpack.getModule(Filters.byKeys('VIEW_MESSAGE_REQUEST', 'VIEW_THREAD'), { searchExports: true })
export const useMessageRequestSidebarState = getMangled(Filters.byStrings('getSidebarState', 'VIEW_MESSAGE_REQUEST'))
export const App = Webpack.getByKeys('setEnableHardwareAcceleration', 'releaseChannel')
export const Message = Webpack.getModule(m => Filters.byStrings('must not be a thread starter message')(m?.type), { searchExports: true })
export const MessageDivider = Webpack.getModule(m => Filters.byStrings('divider', 'unreadPill')(m?.render))
export const ChatSearchSidebar = getMangled(Filters.byStrings('getResultsState', 'searchAnalyticsId'))
export const { Select, SingleSelect } = mapModule(Filters.byStrings('SELECT', 'renderPopout', 'closeOnSelect'), {
  Select: Filters.byStrings('SELECT', 'renderPopout', 'closeOnSelect'),
  SingleSelect: m => Filters.byStrings('value', 'onChange')(m) && !Filters.byStrings('isSelected')(m)
}, { withKeys: true })
export const MembersModViewSidebar = getMangled(Filters.byStrings('MEMBER_SAFETY_PAGE', 'closeGuildSidebar'))
export const LayerActions = mapModule(Filters.byStrings('LAYER_PUSH', 'component'), {
  pushLayer: Filters.byStrings('"LAYER_PUSH"'),
  popLayer: Filters.byStrings('"LAYER_POP"'),
  popAllLayers: Filters.byStrings('"LAYER_POP_ALL"')
})
export const LayerStore = Webpack.getStore('LayerStore')
export const Platform = Webpack.getByKeys('isWindows', 'isMac')
