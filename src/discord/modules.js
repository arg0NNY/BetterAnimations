import { Webpack } from '@/BdApi'
import { createElement } from 'react'
import { unkeyedFn, unkeyed, mangled, keyed, lazyKeyed } from '@/utils/webpack'
const { Filters } = Webpack

export const [
  Text,
  Heading,
  ModalBackdrop,
  Clickable,
  Switch,
  Checkbox,
  FormTitle,
  FormTitleTags,
  FormText,
  FormSection,
  Breadcrumbs,
  RadioGroup,
  FormSwitch,
  FormItem,
  Slider,
  ReferencePositionLayer,
  SearchableSelect,
  TextBadge,
  SearchBar,
  Paginator,
  Spinner,
  Popout,
  Routes,
  StaticChannelRoute,
  useStateFromStores,
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
  ChannelAppLauncher,
  AppLauncherPopup,
  GuildIcon,
  Timestamp,
  getThemeClass,
  CSSTransition,
  TransitionGroup,
  ChannelMessageList,
  ChannelView,
  MessageDivider,
  GuildChannelRouteParams,
  handleClick,
  Timeout,
  GatewaySocket,
  { Anchor } = {},
  Dispatcher,
  Transition,
  Flux,
  App,
  Flex,
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
  ListRawModule,
  ToastStoreModule,
  ToastModule,
  AppViewModule,
  RouterModule,
  ContextMenuModule,
  MenuSubmenuItemModule,
  MenuSubmenuListItemModule,
  PopoutCSSAnimatorModule,
  AppLayerModule,
  ModalsModule,
  LayersModule,
  GuildChannelListModule,
  ChannelSectionStore,
  ChatSidebarModule,
  VoiceChannelViewModule,
  CallChatSidebarModule,
  SelectModule,
  LayerActionsModule,
  AlertModule,
  UserSettingsModal,
  ModalModule,
  MenuItemModule,
  ChannelItemModule,
  VoiceChannelItemModule,
  StageVoiceChannelItemModule,
  AppContextModule,
  ExpressionPickerStoreModule,
  ProfileEffectsModule,
  EmojiModule,
  UseIsVisibleModule,
  RootElementContextModule,
  ListNavigatorModule,
  FocusLockModule,
  ManaModalRootModule
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
  // ModalBackdrop
  {
    filter: m => Filters.byStrings('backdrop', 'BG_BACKDROP_NO_OPACITY')(m?.render),
    searchExports: true
  },
  // Clickable
  {
    filter: Filters.byPrototypeKeys('renderInner', 'renderNonInteractive'),
    searchExports: true
  },
  // Switch
  {
    filter: Filters.byStrings('checkbox', 'animated.rect'),
    searchExports: true
  },
  // Checkbox
  {
    filter: m => Filters.byKeys('BOX', 'ROUND')(m?.Shapes),
    searchExports: true
  },
  // FormTitle
  {
    filter: Filters.byStrings('defaultMargin', 'errorMessage'),
    searchExports: true
  },
  // FormTitleTags
  {
    filter: Filters.byKeys('H1', 'LABEL', 'LEGEND'),
    searchExports: true
  },
  // FormText
  {
    filter: m => Filters.byKeys('DESCRIPTION', 'ERROR')(m?.Types),
    searchExports: true
  },
  // FormSection
  {
    filter: m => Filters.byStrings('titleId', 'sectionTitle')(m?.render),
    searchExports: true
  },
  // Breadcrumbs
  {
    filter: m => Filters.byStrings('renderBreadcrumb')(m?.prototype?.render),
    searchExports: true
  },
  // RadioGroup
  {
    filter: m => Filters.byKeys('NOT_SET', 'NONE')(m?.Sizes),
    searchExports: true
  },
  // FormSwitch
  {
    filter: Filters.byStrings('labelRow', 'checked'),
    searchExports: true
  },
  // FormItem
  {
    filter: m => Filters.byStrings('titleId', 'errorId', 'setIsFocused')(m?.render),
    searchExports: true
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
  // SearchableSelect
  {
    filter: m => Filters.byStrings('searchable', 'select')(m?.render),
    searchExports: true
  },
  // TextBadge
  {
    filter: Filters.byStrings('textBadge', 'STATUS_DANGER'),
    searchExports: true
  },
  // SearchBar
  {
    filter: m => Filters.byKeys('isLoading', 'size')(m?.defaultProps) && Filters.byPrototypeKeys('blur', 'focus')(m),
    searchExports: true
  },
  // Paginator
  {
    filter: Filters.byStrings('pageControlContainer', 'endButtonInner'),
    searchExports: true
  },
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
  // useStateFromStores
  {
    filter: Filters.byStrings('useStateFromStores'),
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
    filter: Filters.byStrings('inputWrapper', 'prefixElement'),
    searchExports: true
  },
  // AppPanels
  {
    filter: m => Filters.byStrings('panels', 'ACCOUNT_PANEL')(m?.type),
    searchExports: true
  },
  // GuildActionRow
  {
    filter: Filters.byKeys('GUILD_ROLE_SUBSCRIPTIONS', 'CHANNELS_AND_ROLES'),
    searchExports: true
  },
  // Message
  {
    filter: m => Filters.byStrings('must not be a thread starter message')(m?.type),
    searchExports: true
  },
  // ChannelTextArea
  {
    filter: m => Filters.byStrings('channelTextArea', 'markdown')(m?.type?.render)
  },
  // ExpressionPicker
  {
    filter: m => Filters.byStrings('EXPRESSION_PICKER', 'positionContainer')(m?.type),
    searchExports: true
  },
  // ChannelTextAreaButtons
  {
    filter: m => Filters.byStrings('buttons', 'sticker', 'gif')(m?.type),
    searchExports: true
  },
  // ChannelAppLauncher
  {
    filter: m => Filters.byStrings('channelAppLauncher')(m?.type),
    searchExports: true
  },
  // AppLauncherPopup
  {
    filter: m => Filters.byStrings('positionLayer', '"positionTargetRef"')(m?.type),
    searchExports: true
  },
  // GuildIcon
  {
    filter: m => Filters.byKeys('badgeStrokeColor', 'animate')(m?.defaultProps),
    searchExports: true
  },
  // Timestamp
  {
    filter: m => Filters.byStrings('timestamp', 'timestampTooltip')(m?.type),
    searchExports: true
  },
  // getThemeClass
  {
    filter: Filters.byStrings('" theme-"'),
    searchExports: true
  },
  // CSSTransition
  {
    filter: m => m?.defaultProps?.classNames === ''
  },
  // TransitionGroup
  {
    filter: m => Filters.byPrototypeKeys('handleExited')(m) && !m.childContextTypes,
    searchExports: true
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
    filter: m => Filters.byStrings('divider', 'unreadPill')(m?.render)
  },
  // GuildChannelRouteParams
  {
    filter: m => Filters.byStrings('escapeRegExp')(m?.guildId),
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
    filter: m => m?.dispatcher?.scheduler,
    searchExports: true
  },
  // Anchor
  {
    filter: Filters.byKeys('Anchor')
  },
  // Dispatcher
  {
    filter: Filters.byKeys('dispatch', 'subscribe')
  },
  // Transition
  {
    filter: Filters.byKeys('ENTERING', 'EXITING', 'contextType')
  },
  // Flux
  {
    filter: Filters.byKeys('Store', 'connectStores')
  },
  // App
  {
    filter: Filters.byKeys('setEnableHardwareAcceleration', 'releaseChannel')
  },
  // Flex
  {
    filter: Filters.byKeys('Direction', 'Justify', 'Child')
  },
  // Parser
  {
    filter: Filters.byKeys('defaultRules', 'parse')
  },
  // InviteEmbed
  {
    filter: Filters.byStrings('Invite Button Embed', 'getInvite')
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
    filter: Filters.byStoreName('PrivateChannelSortStore')
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
    filter: Filters.bySource('POPOUT', 'OVERLAY', 'modalKey')
  },
  // TooltipModule
  {
    filter: Filters.bySource('renderTooltip', 'tooltipPointer')
  },
  // ListRawModule
  {
    filter: Filters.bySource('thin', 'none', 'fade', 'ResizeObserver'),
    raw: true
  },
  // ToastStoreModule
  {
    filter: Filters.bySource('currentToast', 'queuedToasts')
  },
  // ToastModule
  {
    filter: Filters.bySource('toast', 'FAILURE', 'STATUS_DANGER')
  },
  // AppViewModule
  {
    filter: Filters.bySource('CHANNEL_THREAD_VIEW', 'GUILD_DISCOVERY', 'data-fullscreen')
  },
  // RouterModule
  {
    filter: Filters.bySource('props.computedMatch', 'isExact')
  },
  // ContextMenuModule
  {
    filter: Filters.bySource('getContextMenu', 'renderWindow')
  },
  // MenuSubmenuItemModule
  {
    filter: Filters.bySource('subMenuClassName', 'submenuPaddingContainer')
  },
  // MenuSubmenuListItemModule
  {
    filter: Filters.bySource('menuSubmenuProps', 'listClassName', 'submenuPaddingContainer')
  },
  // PopoutCSSAnimatorModule
  {
    filter: Filters.bySource('animatorTop', 'TRANSLATE')
  },
  // AppLayerModule
  {
    filter: Filters.bySource('layerContext', '"App"')
  },
  // ModalsModule
  {
    filter: Filters.bySource('modalKey', '"layer-"')
  },
  // LayersModule
  {
    filter: Filters.bySource('getLayers', 'hasFullScreenLayer')
  },
  // GuildChannelListModule
  {
    filter: Filters.bySource('GUILD_CHANNEL_LIST', 'favorites-channel-list')
  },
  // ChannelSectionStore
  {
    filter: Filters.byStoreName('ChannelSectionStore')
  },
  // ChatSidebarModule
  {
    filter: Filters.bySource('sidebarType', 'postSidebarWidth')
  },
  // VoiceChannelViewModule
  {
    filter: Filters.bySource('shouldUseVoiceEffectsActionBar')
  },
  // CallChatSidebarModule
  {
    filter: Filters.bySource('CallChatSidebar', 'chatInputType')
  },
  // SelectModule
  {
    filter: Filters.bySource('select', 'newValues')
  },
  // LayerActionsModule
  {
    filter: Filters.bySource('"LAYER_PUSH"', '"LAYER_POP_ALL"')
  },
  // AlertModule
  {
    filter: Filters.bySource('messageType', 'iconDiv')
  },
  // UserSettingsModal
  {
    filter: Filters.byKeys('open', 'setSection', 'updateAccount')
  },
  // ModalModule
  {
    filter: Filters.bySource('MODAL', 'rootWithShadow')
  },
  // MenuItemModule
  {
    filter: Filters.bySource('dontCloseOnActionIfHoldingShiftKey', 'data-menu-item')
  },
  // ChannelItemModule
  {
    filter: Filters.bySource('shouldIndicateNewChannel', 'MANAGE_CHANNELS')
  },
  // VoiceChannelItemModule
  {
    filter: Filters.bySource('isFavoriteSuggestion', 'PLAYING', 'MANAGE_CHANNELS')
  },
  // StageVoiceChannelItemModule
  {
    filter: Filters.bySource('getStageInstanceByChannel', 'isFavoriteSuggestion', 'MANAGE_CHANNELS')
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
    filter: Filters.bySource('profileEffectConfig', 'useReducedMotion')
  },
  // EmojiModule
  {
    filter: Filters.bySource('"Unknown Src for Emoji"')
  },
  // UseIsVisibleModule
  {
    filter: Filters.bySource('isIntersecting', 'threshold:1')
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
    filter: Filters.bySource('disableReturnRef', '"app-mount"')
  },
  // ManaModalRootModule
  {
    filter: Filters.bySource('MODAL', '"padding-size-"')
  }
)

export const ModalActions = mangled(ModalActionsModule, {
  openModal: Filters.byStrings('onCloseRequest', 'onCloseCallback', 'backdropStyle'),
  closeModal: Filters.byStrings('onCloseCallback()', 'filter'),
  closeAllModals: Filters.byRegex(/for\(let \w+ of \w+\[\w+]\)\w+\(\w+\.key,\w+\)/)
})
export const { Tooltip, TooltipLayer } = mangled(TooltipModule, {
  Tooltip: Filters.byPrototypeKeys('renderTooltip'),
  TooltipLayer: Filters.byStrings('tooltipPointer')
})
export const ListThin = (() => {
  if (!ListRawModule) return
  const { id, exports } = ListRawModule
  const source = Webpack.modules[id].toString()
  return exports[
    source.match(new RegExp(`(\\w+):\\(\\)=>${source.match(/let (\w+)=/)[1]}`))[1]
  ]
})()
export const { showToast, popToast, useToastStore } = mangled(ToastStoreModule, {
  showToast: Filters.byRegex(/queuedToasts:\[...\w+\.queuedToasts,\w+\]/),
  popToast: Filters.byStrings('currentToast:null'),
  useToastStore: Filters.byKeys('setState')
})
export const popToastKeyed = keyed(ToastStoreModule, Filters.byStrings('currentToast:null'))
export const { Toast, createToast } = mangled(ToastModule, {
  Toast: Filters.byKeys('type'),
  createToast: Filters.byStrings('type', 'position')
})
export const AppViewKeyed = keyed(AppViewModule, Filters.byStrings('CHANNEL_THREAD_VIEW', 'GUILD_DISCOVERY'))
export const Router = mangled(RouterModule, {
  Router: m => m?.computeRootMatch,
  Route: m => Filters.byStrings('props.computedMatch', 'props.path')(m?.prototype?.render),
  Switch: m => Filters.byStrings('props.location', 'cloneElement')(m?.prototype?.render),
  matchPath: Filters.byStrings('strict', 'isExact'),
  useLocation: Filters.byRegex(/return \w+\(\w+\)\.location/),
  useParams: Filters.byStrings('.match', '.params')
})
export const TransitionGroupContext = Transition && new Transition({ children: createElement('div') }).render().type
export const ContextMenuKeyed = keyed(ContextMenuModule, Filters.byStrings('getContextMenu', 'isOpen'))
export const MenuSubmenuItemKeyed = keyed(MenuSubmenuItemModule, Filters.byStrings('subMenuClassName', 'submenuPaddingContainer'))
export const MenuSubmenuListItemKeyed = keyed(MenuSubmenuListItemModule, Filters.byStrings('menuSubmenuProps', 'listClassName', 'submenuPaddingContainer'))
export const PopoutCSSAnimatorKeyed = keyed(PopoutCSSAnimatorModule, m => Filters.byKeys('TRANSLATE', 'SCALE')(m?.Types))
export const { AppLayer, appLayerContext } = mangled(AppLayerModule, {
  AppLayer: Filters.byDisplayName('AppLayer'),
  appLayerContext: m => m?.Provider
})
export const ModalsKeyed = keyed(ModalsModule, Filters.byStrings('modalKey', '"layer-"'))
export const LayersKeyed = keyed(LayersModule, Filters.byStrings('hasFullScreenLayer'))
export const GuildChannelListKeyed = keyed(GuildChannelListModule, Filters.byStrings('getGuild', 'guildId'))
export const ChatSidebarKeyed = keyed(ChatSidebarModule, Filters.byStrings('sidebarType', 'postSidebarWidth'))
export const VoiceChannelViewKeyed = keyed(VoiceChannelViewModule, Filters.byStrings('shouldUseVoiceEffectsActionBar'))
export const CallChatSidebarKeyed = keyed(CallChatSidebarModule, Filters.byStrings('CallChatSidebar', 'chatInputType'))
export const SelectKeyed = keyed(SelectModule, Filters.byStrings('listbox', 'renderPopout', 'closeOnSelect'))
export const SingleSelectKeyed = keyed(SelectModule, m => Filters.byStrings('value', 'onChange')(m) && !Filters.byStrings('isSelected')(m))
export const SingleSelect = unkeyedFn(SingleSelectKeyed)
export const LayerActions = mangled(LayerActionsModule, {
  pushLayer: Filters.byStrings('"LAYER_PUSH"'),
  popLayer: Filters.byStrings('"LAYER_POP"'),
  popAllLayers: Filters.byStrings('"LAYER_POP_ALL"')
})
export const { Alert, AlertTypes } = mangled(AlertModule, {
  Alert: Filters.byStrings('messageType', 'iconDiv'),
  AlertTypes: Filters.byKeys('WARNING', 'ERROR')
})
export const { ModalRoot, ModalSize, ModalHeader, ModalFooter, ModalContent, ModalCloseButton } = mangled(ModalModule, {
  ModalRoot: Filters.byStrings('MODAL', 'rootWithShadow'),
  ModalSize: Filters.byKeys('MEDIUM', 'LARGE'),
  ModalHeader: Filters.byStrings('headerIdIsManaged', 'HORIZONTAL'),
  ModalFooter: Filters.byStrings('footerSeparator'),
  ModalContent: Filters.byStrings('content', 'scrollbarType'),
  ModalCloseButton: Filters.byStrings('closeIcon')
})
export const MenuItemKeyed = keyed(MenuItemModule, Filters.byStrings('dontCloseOnActionIfHoldingShiftKey', 'data-menu-item'))
export const ChannelItemKeyed = keyed(ChannelItemModule, Filters.byStrings('shouldIndicateNewChannel', 'MANAGE_CHANNELS'))
export const VoiceChannelItemKeyed = keyed(VoiceChannelItemModule, Filters.byStrings('PLAYING', 'MANAGE_CHANNELS'))
export const StageVoiceChannelItemKeyed = keyed(StageVoiceChannelItemModule, Filters.byStrings('getStageInstanceByChannel', 'MANAGE_CHANNELS'))
export const { AppContext } = mangled(AppContextModule, { AppContext: m => m?.Provider })
export const useExpressionPickerStoreKeyed = keyed(ExpressionPickerStoreModule, Filters.byKeys('getState', 'setState'))
export const ProfileEffectsKeyed = keyed(ProfileEffectsModule, Filters.byStrings('profileEffectConfig', 'useReducedMotion'))
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
  ModalRootKeyed: keyed(ManaModalRootModule, Filters.byStrings('MODAL', '"padding-size-"')),
  get ModalRoot () { return unkeyed(this.ModalRootKeyed) }
}

export const StandardSidebarViewWrapper = Webpack.waitForModule(Filters.byPrototypeKeys('getPredicateSections', 'renderSidebar'))
export const StandardSidebarViewModule = Webpack.waitForModule(Filters.bySource('standardSidebarView', 'section'))
export const StandardSidebarViewKeyed = lazyKeyed(StandardSidebarViewModule, Filters.byStrings('standardSidebarView', 'section'))
export const SettingsNotice = Webpack.waitForModule(Filters.byStrings('resetButton', 'EMPHASIZE_NOTICE'))
export const MembersModViewSidebarModule = Webpack.waitForModule(Filters.bySource('MEMBER_SAFETY_PAGE', 'closeGuildSidebar'))
export const MembersModViewSidebarKeyed = lazyKeyed(MembersModViewSidebarModule, Filters.byStrings('MEMBER_SAFETY_PAGE', 'closeGuildSidebar'))
export const GenerateUserSettingsSectionsModule = Webpack.waitForModule(Filters.bySource('ACCOUNT_PROFILE', 'CUSTOM', '"logout"'))
export const generateUserSettingsSectionsKeyed = lazyKeyed(GenerateUserSettingsSectionsModule, Filters.byStrings('ACCOUNT_PROFILE', 'CUSTOM', '"logout"'))
