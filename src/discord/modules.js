import { Webpack } from '@/BdApi'
import { createElement } from 'react'
import { unkeyedFn, unkeyed, mangled, keyed, lazyKeyed } from '@/utils/webpack'
const { Filters } = Webpack

export const [
  Text,
  Heading,
  ModalScrimModule,
  Clickable,
  Switch,
  SwitchIndicator,
  CheckboxModule,
  FieldSet,
  Breadcrumbs,
  RadioGroupModule,
  Slider,
  ReferencePositionLayer,
  BadgeModule,
  SearchBar,
  // Paginator,
  Spinner,
  Popout,
  Routes,
  StaticChannelRoute,
  BasePopout,
  SpringTransitionPhases,
  Button,
  TextButton,
  ButtonGroup,
  InviteStates,
  TextInput,
  AppPanels,
  GuildActionRow,
  Message,
  ChannelTextArea,
  ExpressionPicker,
  ChannelTextAreaButtons,
  GuildIcon,
  Timestamp,
  getThemeClass,
  { Transition, CSSTransition, TransitionGroup } = {},
  ChannelMessageList,
  ChannelView,
  MessageDivider,
  GuildChannelRouteParams,
  handleClick,
  Timeout,
  GatewaySocket,
  { Anchor } = {},
  Dispatcher,
  Flux,
  App,
  Stack,
  { defaultRules: Parser } = {},
  InviteEmbed,
  InviteActions,
  { ImpressionNames } = {},
  { colors } = {},
  humanize,
  useListNavigator,
  ThemeStore,
  ChannelStore,
  SortedGuildStore,
  PrivateChannelSortStore,
  LayerStore,
  InviteStore,
  SelectedGuildStore,
  SelectedChannelStore,
  GuildStore,
  ModalActionsModule,
  TooltipModule,
  ToastStoreModule,
  ToastModule,
  AppViewRawModule,
  RouterModule,
  ContextMenuModule,
  MenuSubmenuItemRawModule,
  MenuSubmenuListItemRawModule,
  PopoutCSSAnimatorRawModule,
  AppLayerModule,
  ModalsModule,
  LayersRawModule,
  GuildChannelListModule,
  ChannelSectionStore,
  ChatSidebarModule,
  { SingleSelect } = {},
  LayerActionsModule,
  AlertModule,
  UserSettings,
  ModalModule,
  MenuItemRawModule,
  ChannelItemRawModule,
  VoiceChannelItemRawModule,
  StageVoiceChannelItemRawModule,
  AppContextModule,
  ExpressionPickerStoreModule,
  ProfileEffectsModule,
  EmojiModule,
  UseIsVisibleModule,
  RootElementContextModule,
  ListNavigatorModule,
  FocusLockModule,
  ManaModalRootModule,
  BasePopoverModule,
  ChannelThreadList,
  matchSorter,
  CopiableField,
  SidebarActions,
  SidebarType,
  ManaTooltipLayer,
  ManaUseTooltipTransitionModule
] = Webpack.getBulk(
  // Text
  {
    filter: m => Filters.byStrings('WebkitLineClamp', 'data-text-variant')(m?.render),
    searchExports: true
  },
  // Heading
  {
    filter: m => Filters.byStrings('variant', 'data-excessive-heading-level')(m?.render),
    searchExports: true
  },
  // ModalScrimModule
  {
    filter: Filters.bySource('scrim', '"lightbox"')
  },
  // Clickable
  {
    filter: Filters.byPrototypeKeys('renderInner', 'renderNonInteractive'),
    searchExports: true
  },
  // Switch
  {
    filter: Filters.byStrings('checked', '.controlId')
  },
  // SwitchIndicator
  {
    filter: Filters.bySource('checked', 'SWITCH_BACKGROUND_DEFAULT'),
    declarationFilter: Filters.byStrings('checked', 'SWITCH_BACKGROUND_DEFAULT')
  },
  // CheckboxModule
  {
    filter: Filters.bySource('Checkbox:', 'is not a valid hex color')
  },
  // FieldSet
  {
    filter: Filters.byStrings('"fieldset"', '"legend"'),
    searchExports: true
  },
  // Breadcrumbs
  {
    filter: m => Filters.byStrings('renderBreadcrumb')(m?.prototype?.render),
    searchExports: true
  },
  // RadioGroupModule
  {
    filter: Filters.bySource('"radiogroup"', 'getFocusableElements')
  },
  // Slider
  {
    filter: m => Filters.byKeys('stickToMarkers', 'initialValue')(m?.defaultProps),
    searchExports: true
  },
  // ReferencePositionLayer
  {
    filter: Filters.byPrototypeKeys('getHorizontalAlignmentStyle', 'nudgeLeftAlignment'),
    searchExports: true
  },
  // BadgeModule
  {
    filter: Filters.bySource('"eyebrow"', 'EARLY_ACCESS')
  },
  // SearchBar
  {
    filter: Filters.byStrings('query', '"aria-label":', 'clearable:null'),
    searchExports: true
  },
  // Paginator
  // {
  //   filter: Filters.byStrings('disablePaginationGap', 'hasMultiplePages'),
  //   searchExports: true
  // },
  // Spinner
  {
    filter: m => Filters.byKeys('WANDERING_CUBES')(m?.Type),
    searchExports: true
  },
  // Popout
  {
    filter: m => Filters.byKeys('Animation')(m) && Filters.byStrings('renderPopout')(m?.prototype?.render),
    searchExports: true
  },
  // Routes
  {
    filter: Filters.byKeys('CHANNEL_THREAD_VIEW', 'GUILD_DISCOVERY'),
    searchExports: true
  },
  // StaticChannelRoute
  {
    filter: Filters.byKeys('ROLE_SUBSCRIPTIONS', 'CHANNEL_BROWSER'),
    searchExports: true
  },
  // BasePopout
  {
    filter: m => m?.defaultProps?.loadingComponent,
    searchExports: true
  },
  // SpringTransitionPhases
  {
    filter: Filters.byKeys('ENTER', 'LEAVE'),
    searchExports: true
  },
  // Button
  {
    filter: Filters.byStrings('button', 'hasText', 'expressiveWrapper'),
    searchExports: true
  },
  // TextButton
  {
    filter: Filters.byStrings('textButton', 'textVariant'),
    searchExports: true
  },
  // ButtonGroup
  {
    filter: Filters.byStrings('fullWidth', 'wrap', '"horizontal"'),
    searchExports: true
  },
  // InviteStates
  {
    filter: Filters.byKeys('APP_NOT_OPENED', 'RESOLVING'),
    searchExports: true
  },
  // TextInput
  {
    filter: Filters.byStrings('"input"', 'prefixElement'),
    searchExports: true
  },
  // AppPanels
  {
    filter: Filters.bySource('panels', 'ACCOUNT_PANEL'),
    declarationFilter: m => Filters.byStrings('panels', 'ACCOUNT_PANEL')(m?.type)
  },
  // GuildActionRow
  {
    filter: Filters.byKeys('GUILD_ROLE_SUBSCRIPTIONS', 'CHANNELS_AND_ROLES'),
    searchExports: true
  },
  // Message
  {
    filter: Filters.bySource('must not be a thread starter message'),
    declarationFilter: m => Filters.byStrings('must not be a thread starter message')(m?.type)
  },
  // ChannelTextArea
  {
    filter: m => Filters.byStrings('CHANNEL_TEXT_AREA', 'markdown')(m?.type?.render)
  },
  // ExpressionPicker
  {
    filter: m => Filters.byStrings('EXPRESSION_PICKER', 'positionContainer')(m?.type),
    searchExports: true
  },
  // ChannelTextAreaButtons
  {
    filter: m => Filters.byStrings('appLauncher', 'sticker', 'gif')(m?.type),
    searchExports: true
  },
  // GuildIcon
  {
    filter: m => Filters.byKeys('badgeStrokeColor', 'animate')(m?.defaultProps),
    searchExports: true
  },
  // Timestamp
  {
    filter: m => Filters.byStrings('timestampFormat', '"LLLL"')(m?.type),
    searchExports: true
  },
  // getThemeClass
  {
    filter: Filters.byStrings('theme-', 'images-'),
    searchExports: true
  },
  // ReactTransitionGroup
  {
    filter: Filters.bySource('performEnter', 'setNextCallback'),
    map: {
      Transition: Filters.byKeys('ENTERING', 'EXITING'),
      CSSTransition: Filters.byPrototypeKeys('addClass'),
      TransitionGroup: Filters.byPrototypeKeys('handleExited')
    },
    mapDeclarations: true
  },
  // ChannelMessageList
  {
    filter: m => Filters.byStrings('channel', 'messageDisplayCompact')(m?.type)
  },
  // ChannelView
  {
    filter: m => Filters.byStrings('providedChannel')(m?.type)
  },
  // MessageDivider
  {
    filter: m => Filters.byStrings('"span"', 'isUnread')(m?.render)
  },
  // GuildChannelRouteParams
  {
    filter: m => Filters.byStrings('|\\\\d+')(m?.guildId),
    searchExports: true
  },
  // handleClick
  {
    filter: Filters.byStrings('sanitizeUrl', 'shouldConfirm'),
    searchExports: true
  },
  // Timeout
  {
    filter: m => Filters.byPrototypeKeys('isStarted', 'start', 'stop')(m) && Filters.byStrings('setTimeout')(m),
    searchExports: true
  },
  // GatewaySocket
  {
    filter: Filters.bySource('[CONNECTED]', 'gateway'),
    declarationFilter: m => m?.dispatcher?.scheduler
  },
  // Anchor
  {
    filter: Filters.byKeys('Anchor')
  },
  // Dispatcher
  {
    filter: Filters.byKeys('dispatch', 'subscribe'),
    searchExports: true
  },
  // Flux
  {
    filter: Filters.byKeys('Store', 'connectStores')
  },
  // App
  {
    filter: Filters.byKeys('setEnableHardwareAcceleration', 'releaseChannel')
  },
  // Stack
  {
    filter: m => Filters.byStrings('data-direction', 'data-justify')(m?.render),
    searchExports: true
  },
  // Parser
  {
    filter: Filters.byKeys('defaultRules', 'parse')
  },
  // InviteEmbed
  {
    filter: Filters.bySource('Invite Button Embed', 'getInvite'),
    declarationFilter: Filters.byStrings('Invite Button Embed', 'getInvite')
  },
  // InviteActions
  {
    filter: Filters.byKeys('resolveInvite', 'createInvite')
  },
  // ImpressionNames
  {
    filter: Filters.byKeys('ImpressionNames')
  },
  // colors
  {
    filter: Filters.byKeys('colors', 'modules')
  },
  // humanize
  {
    filter: Filters.byKeys('humanize', 'filesize')
  },
  // useListNavigator
  {
    filter: Filters.byStrings('focusLastVisibleItem', '"focus"')
  },
  // ThemeStore
  {
    filter: Filters.byStoreName('ThemeStore')
  },
  // ChannelStore
  {
    filter: Filters.byStoreName('ChannelStore')
  },
  // SortedGuildStore
  {
    filter: Filters.byStoreName('SortedGuildStore')
  },
  // PrivateChannelSortStore
  {
    filter: Filters.byStoreName('PrivateChannelSortStore'),
    searchExports: true
  },
  // LayerStore
  {
    filter: Filters.byStoreName('LayerStore')
  },
  // InviteStore
  {
    filter: Filters.byStoreName('InviteStore')
  },
  // SelectedGuildStore
  {
    filter: Filters.byStoreName('SelectedGuildStore')
  },
  // SelectedChannelStore
  {
    filter: Filters.byStoreName('SelectedChannelStore')
  },
  // GuildStore
  {
    filter: Filters.byStoreName('GuildStore')
  },
  // ModalActionsModule
  {
    filter: Filters.bySource('.modalKey?')
  },
  // TooltipModule
  {
    filter: Filters.bySource('renderTooltip', 'tooltipPointer')
  },
  // ToastStoreModule
  {
    filter: Filters.bySource('currentToast', 'queuedToasts')
  },
  // ToastModule
  {
    filter: Filters.bySource('message', '"data-type"', 'STATUS_POSITIVE', 'CLIP')
  },
  // AppViewRawModule
  {
    filter: Filters.bySource('CHANNEL_THREAD_VIEW', 'GUILD_DISCOVERY', 'data-fullscreen'),
    raw: true
  },
  // RouterModule
  {
    filter: Filters.bySource('props.computedMatch', 'isExact')
  },
  // ContextMenuModule
  {
    filter: Filters.bySource('getContextMenu', 'renderWindow')
  },
  // MenuSubmenuItemRawModule
  {
    filter: Filters.bySource('subMenuClassName', 'submenuPaddingContainer'),
    raw: true
  },
  // MenuSubmenuListItemRawModule
  {
    filter: Filters.bySource('menuSubmenuProps', 'listClassName', 'submenuPaddingContainer'),
    raw: true
  },
  // PopoutCSSAnimatorRawModule
  {
    filter: Filters.bySource('data-popout-animating', 'TRANSLATE'),
    raw: true
  },
  // AppLayerModule
  {
    filter: Filters.bySource('layerContext', '"App"')
  },
  // ModalsModule
  {
    filter: Filters.bySource('modalKey', '"instant"')
  },
  // LayersRawModule
  {
    filter: Filters.bySource('getLayers', 'hasFullScreenLayer'),
    raw: true
  },
  // GuildChannelListModule
  {
    filter: Filters.bySource('GUILD_CHANNEL_LIST', 'selectedChannel')
  },
  // ChannelSectionStore
  {
    filter: Filters.byStoreName('ChannelSectionStore')
  },
  // ChatSidebarModule
  {
    filter: Filters.bySource('sidebarType', 'postSidebarWidth')
  },
  // SelectModule
  // TODO: Migrate to Mana Select
  {
    filter: Filters.bySource('select', 'newValues'),
    map: {
      SingleSelect: Filters.byStrings('"single"', 'clear:()=>')
    }
  },
  // LayerActionsModule
  {
    filter: Filters.bySource('"LAYER_PUSH"', '"LAYER_POP_ALL"')
  },
  // AlertModule
  {
    filter: Filters.bySource('messageType', '"warn"')
  },
  // UserSettings
  {
    filter: Filters.byKeys('openUserSettings')
  },
  // ModalModule
  {
    filter: Filters.bySource('MODAL_ROOT_LEGACY', 'headerId')
  },
  // MenuItemRawModule
  {
    filter: Filters.bySource('dontCloseOnActionIfHoldingShiftKey', 'data-menu-item'),
    raw: true
  },
  // ChannelItemRawModule
  {
    filter: Filters.bySource('shouldIndicateNewChannel', 'MANAGE_CHANNELS'),
    raw: true
  },
  // VoiceChannelItemRawModule
  {
    filter: Filters.bySource('isFavoriteSuggestion', 'PLAYING', 'MANAGE_CHANNELS'),
    raw: true
  },
  // StageVoiceChannelItemRawModule
  {
    filter: Filters.bySource('getStageInstanceByChannel', 'isFavoriteSuggestion', 'MANAGE_CHANNELS'),
    raw: true
  },
  // AppContextModule
  {
    filter: Filters.bySource('renderWindow', 'ownerDocument.defaultView')
  },
  // ExpressionPickerStoreModule
  {
    filter: Filters.bySource('expression-picker-last-active-view')
  },
  // ProfileEffectsModule
  {
    filter: Filters.bySource('profileEffect', 'animationType', 'useReducedMotion')
  },
  // EmojiModule
  {
    filter: Filters.bySource('"Unknown Src for Emoji"')
  },
  // UseIsVisibleModule
  {
    filter: Filters.bySource('isIntersecting', 'new Map([[1,{threshold:1}]])')
  },
  // RootElementContextModule
  {
    filter: Filters.bySource('useRootElementContext', 'createContext')
  },
  // ListNavigatorModule
  {
    filter: Filters.bySource('NO_LIST', 'listitem')
  },
  // FocusLockModule
  {
    filter: Filters.bySource('disableReturnRef', 'containerRef')
  },
  // ManaModalRootModule
  {
    filter: Filters.bySource('MODAL', 'padding-size-')
  },
  // BasePopoverModule
  {
    filter: Filters.bySource('popoverGradientWrapper', 'spacing')
  },
  // ChannelThreadList
  {
    filter: Filters.bySource('sortedThreadIds', '"group"'),
    declarationFilter: m => Filters.byStrings('sortedThreadIds', '"group"')(m?.type)
  },
  // matchSorter
  {
    filter: m => Filters.byKeys('MATCHES', 'STARTS_WITH')(m?.rankings),
    searchExports: true
  },
  // CopiableField
  {
    filter: Filters.byStrings('copyValue', 'TEXT_COPIED'),
    searchExports: true
  },
  // SidebarActions
  {
    filter: Filters.byKeys('setSelectedSearchContext')
  },
  // SidebarType
  {
    filter: Filters.byKeys('VIEW_THREAD', 'VIEW_MOD_REPORT'),
    searchExports: true
  },
  // ManaTooltipLayer
  {
    filter: Filters.byStrings('"tooltip"', 'isRichTooltip'),
    searchExports: true
  },
  // ManaUseTooltipTransitionModule
  {
    filter: Filters.bySource('onExitComplete', '"tooltip"')
  }
)

export const { RadioGroup } = mangled(RadioGroupModule, {
  RadioGroup: Filters.byStrings('label', 'description')
})
export const { Badge } = mangled(BadgeModule, {
  Badge: Filters.byStrings('"eyebrow"')
})
export const ModalScrimKeyed = keyed(ModalScrimModule, Filters.byStrings('scrim', 'isVisible'))
export const { Checkbox, CheckboxTypes } = mangled(CheckboxModule, {
  Checkbox: Filters.byStrings('innerClassName'),
  CheckboxTypes: Filters.byKeys('INVERTED')
})
export const { useModalsStore, useIsModalAtTop, ...ModalActions } = mangled(ModalActionsModule, {
  openModal: Filters.byStrings('onCloseRequest', 'onCloseCallback', 'stackingBehavior'),
  closeModal: Filters.byStrings('onCloseCallback()', 'filter'),
  closeAllModals: Filters.byStrings('.getState();for'),
  useModalsStore: Filters.byKeys('setState'),
  useIsModalAtTop: Filters.byStrings('popout:', '.at(-1)')
})
export const { Tooltip } = mangled(TooltipModule, {
  Tooltip: Filters.byPrototypeKeys('renderTooltip')
})
export const { showToast, useToastStore } = mangled(ToastStoreModule, {
  showToast: Filters.byStrings('currentToastMap.has'),
  useToastStore: Filters.byKeys('setState')
})
export const popToastKeyed = keyed(ToastStoreModule, Filters.byStrings('.delete'))
export const popToast = unkeyedFn(popToastKeyed)
export const { Toast, createToast } = mangled(ToastModule, {
  Toast: Filters.byKeys('type'),
  createToast: Filters.byStrings('type', 'position')
})
export const AppViewKeyed = keyed(AppViewRawModule?.declarations, Filters.byStrings('CHANNEL_THREAD_VIEW', 'GUILD_DISCOVERY'))
export const Router = mangled(RouterModule, {
  Router: m => m?.computeRootMatch,
  Route: m => Filters.byStrings('props.computedMatch', 'props.path')(m?.prototype?.render),
  Switch: m => Filters.byStrings('props.location', 'cloneElement')(m?.prototype?.render),
  matchPath: Filters.byStrings('strict', 'isExact'),
  useLocation: Filters.byStrings(').location'),
  useParams: Filters.byStrings('.match', '.params')
})
export const TransitionGroupContext = Transition?.contextType
export const ContextMenuKeyed = keyed(ContextMenuModule, Filters.byStrings('getContextMenu', 'isOpen'))
export const MenuSubmenuItemKeyed = keyed(MenuSubmenuItemRawModule?.declarations, Filters.byStrings('subMenuClassName', 'submenuPaddingContainer'))
export const MenuSubmenuListItemKeyed = keyed(MenuSubmenuListItemRawModule?.declarations, Filters.byStrings('menuSubmenuProps', 'listClassName', 'submenuPaddingContainer'))
export const PopoutCSSAnimatorKeyed = keyed(PopoutCSSAnimatorRawModule?.declarations, m => Filters.byKeys('TRANSLATE', 'SCALE')(m?.Types))
export const { AppLayer, appLayerContext } = mangled(AppLayerModule, {
  AppLayer: Filters.byDisplayName('AppLayer'),
  appLayerContext: m => m?.Provider
})
export const ModalsKeyed = keyed(ModalsModule, Filters.byStrings('modalKey', '"instant"'))
export const LayersKeyed = keyed(LayersRawModule?.declarations, Filters.byStrings('getLayers', 'hasFullScreenLayer'))
export const GuildChannelListKeyed = keyed(GuildChannelListModule, Filters.byStrings('getGuild', 'guildId'))
export const ChatSidebarKeyed = keyed(ChatSidebarModule, Filters.byStrings('postSidebarWidth'))
export const LayerActions = mangled(LayerActionsModule, {
  pushLayer: Filters.byStrings('"LAYER_PUSH"'),
  popLayer: Filters.byStrings('"LAYER_POP"'),
  popAllLayers: Filters.byStrings('"LAYER_POP_ALL"')
})
export const { Alert, AlertTypes } = mangled(AlertModule, {
  Alert: Filters.byStrings('messageType'),
  AlertTypes: Filters.byKeys('WARNING', 'ERROR')
})
export const { ModalRoot, ModalSize, ModalHeader, ModalFooter, ModalContent } = mangled(ModalModule, {
  ModalRoot: Filters.byStrings('MODAL_ROOT_LEGACY'),
  ModalSize: Filters.byKeys('MEDIUM', 'LARGE'),
  ModalHeader: Filters.byStrings('headerIdIsManaged', 'HORIZONTAL'),
  ModalFooter: Filters.byStrings('separator', 'HORIZONTAL_REVERSE'),
  ModalContent: Filters.byStrings('scrollbarType')
})
export const MenuItemKeyed = keyed(MenuItemRawModule?.declarations, Filters.byStrings('dontCloseOnActionIfHoldingShiftKey', 'data-menu-item'))
export const ChannelItemKeyed = keyed(ChannelItemRawModule?.declarations, Filters.byStrings('shouldIndicateNewChannel', 'MANAGE_CHANNELS'))
export const VoiceChannelItemKeyed = keyed(VoiceChannelItemRawModule?.declarations, Filters.byStrings('PLAYING', 'MANAGE_CHANNELS'))
export const StageVoiceChannelItemKeyed = keyed(StageVoiceChannelItemRawModule?.declarations, Filters.byStrings('getStageInstanceByChannel', 'MANAGE_CHANNELS'))
export const { AppContext } = mangled(AppContextModule, { AppContext: m => m?.Provider })
export const useExpressionPickerStoreKeyed = keyed(ExpressionPickerStoreModule, Filters.byKeys('getState', 'setState'))
export const ProfileEffectsKeyed = keyed(ProfileEffectsModule, Filters.byStrings('profileEffect', 'animationType', 'useReducedMotion'))
export const EmojiKeyed = keyed(EmojiModule, Filters.byStrings('emojiId', 'emojiName', 'animated', 'shouldAnimate'))
export const useIsVisibleKeyed = keyed(UseIsVisibleModule, Filters.byStrings('isIntersecting', 'arguments.length'))
export const useIsVisible = unkeyedFn(useIsVisibleKeyed)
export const useRootElementContextKeyed = keyed(RootElementContextModule, Filters.byStrings('useRootElementContext'))
export const { useListItem, useListContainerProps, ListNavigatorProvider } = mangled(ListNavigatorModule, {
  useListItem: Filters.byStrings('"listitem"'),
  useListContainerProps: Filters.byStrings('"list"', 'useContext'),
  ListNavigatorProvider: Filters.byStrings('containerProps', '.Provider')
})
export const ListNavigatorContainer = ({ children }) => children(useListContainerProps())
export const { useFocusLock, FocusLock } = mangled(FocusLockModule, {
  useFocusLock: Filters.byStrings('disableReturnRef'),
  FocusLock: Filters.byStrings('children', 'containerRef')
})
export const Mana = {
  ModalRootKeyed: keyed(ManaModalRootModule, Filters.byStrings('MODAL', 'padding-size-')),
  get ModalRoot () { return unkeyed(this.ModalRootKeyed) },
  TooltipLayer: ManaTooltipLayer,
  useTooltipTransitionKeyed: keyed(ManaUseTooltipTransitionModule, Filters.byStrings('onExitComplete', '"tooltip"'))
}
export const BasePopoverKeyed = keyed(BasePopoverModule, Filters.byStrings('popoverGradientWrapper', 'spacing'))
export const useStateFromStores = Webpack.getModule(Webpack.Filters.byStrings('useStateFromStores'), { searchExports: true })

export const StandardSidebarViewWrapper = Webpack.waitForModule(Filters.byPrototypeKeys('getPredicateSections', 'renderSidebar'))
export const StandardSidebarViewModule = Webpack.waitForModule(Filters.bySource('standardSidebarView', 'section'))
export const StandardSidebarViewKeyed = lazyKeyed(StandardSidebarViewModule, Filters.byStrings('standardSidebarView', 'section'))
export const SettingsNotice = Webpack.waitForModule(Filters.byStrings('onSaveText', 'EMPHASIZE_NOTICE'))
export const MembersModViewSidebarRawModule = Webpack.waitForModule(Filters.bySource('MEMBER_SAFETY_PAGE', 'closeGuildSidebar'), { raw: true })
export const MembersModViewSidebarKeyed = lazyKeyed(MembersModViewSidebarRawModule.then(m => m?.declarations), Filters.byStrings('MEMBER_SAFETY_PAGE', 'closeGuildSidebar'))
export const SettingsContentRawModule = Webpack.waitForModule(Filters.bySource('onClose', '"showNavigationMobile"'), { raw: true })
export const SettingsContent = SettingsContentRawModule.then(m => Object.values(m?.declarations ?? {}).find(m => Filters.byStrings('onClose', '"showNavigationMobile"')(m?.type)))
export const SettingsNodeType = { ROOT: 0, SECTION: 1, SIDEBAR_ITEM: 2, PANEL: 3, PANE: 4 }
export const LayerModalRawModule = Webpack.waitForModule(Filters.bySource('MODAL', 'headingId', 'theme', '"dialog"'), { raw: true })
export const LayerModalKeyed = lazyKeyed(LayerModalRawModule.then(m => m?.declarations), Filters.byStrings('MODAL', 'headingId', 'theme', '"dialog"'))
export const CallChatSidebarModule = Webpack.waitForModule(Filters.bySource('CallChatSidebar', 'chatInputType'))
export const CallChatSidebarKeyed = lazyKeyed(CallChatSidebarModule, Filters.byStrings('CallChatSidebar', 'chatInputType'))
export const VoiceChannelViewModule = Webpack.waitForModule(Filters.bySource('CHANNEL_CALL_POPOUT', 'renderExternalHeader'))
export const VoiceChannelViewKeyed = lazyKeyed(VoiceChannelViewModule, Filters.byStrings('CHANNEL_CALL'))
