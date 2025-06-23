import { Webpack } from '@/BdApi'
import { createElement } from 'react'
import { getWithKey, getMangled, UnkeyedComponent } from '@/utils/webpack'
const { Filters } = Webpack

export const ModalActions = Webpack.getMangled(Filters.bySource('POPOUT', 'OVERLAY', 'modalKey'), {
  openModal: Filters.byStrings('onCloseRequest', 'onCloseCallback', 'backdropStyle'),
  closeModal: Filters.byStrings('onCloseCallback()', 'filter'),
  closeAllModals: Filters.byRegex(/for\(let \w+ of \w+\[\w+]\)\w+\(\w+\.key,\w+\)/)
})
export const Text = Webpack.getModule(m => Filters.byStrings('WebkitLineClamp', 'data-text-variant')(m?.render), { searchExports: true })
export const Heading = Webpack.getModule(m => Filters.byStrings('variant', 'data-excessive-heading-level')(m?.render), { searchExports: true })
export const { ConfirmModal } = Webpack.getByKeys('ConfirmModal')
export const { Tooltip, TooltipLayer } = Webpack.getMangled(Filters.byPrototypeKeys('renderTooltip'), {
  Tooltip: Filters.byPrototypeKeys('renderTooltip'),
  TooltipLayer: Filters.byStrings('tooltipPointer')
}, { searchExports: true, raw: true })
export const ModalBackdrop = Webpack.getModule(m => Filters.byStrings('backdrop', 'BG_BACKDROP_NO_OPACITY')(m?.render), { searchExports: true })
export const ListThin = (() => {
  const { id, exports } = Webpack.getModule(Filters.bySource('thin', 'customTheme', 'ResizeObserver'), { raw: true })
  const source = Webpack.modules[id].toString()
  return exports[
    source.match(new RegExp(`(\\w+):\\(\\)=>${source.match(/let (\w+)=/)[1]}`))[1]
  ]
})()
export const ToastPosition = Webpack.getModule(Filters.byKeys('MESSAGE', 'SUCCESS', 'FAILURE'), { searchExports: true })
export const { showToast, popToast, useToastStore } = Webpack.getMangled(Filters.bySource('currentToast', 'queuedToasts'), {
  showToast: Filters.byRegex(/queuedToasts:\[...\w+\.queuedToasts,\w+\]/),
  popToast: Filters.byStrings('currentToast:null'),
  useToastStore: Filters.byKeys('setState')
})
export const popToastKeyed = [...Webpack.getWithKey(Filters.byStrings('currentToast:null'))]
export const { Toast, createToast } = Webpack.getMangled(Filters.bySource('toast', 'FAILURE', 'STATUS_DANGER'), {
  Toast: Filters.byKeys('type'),
  createToast: Filters.byStrings('type', 'position')
})
export const Clickable = Webpack.getModule(Filters.byPrototypeKeys('renderInner', 'renderNonInteractive'), { searchExports: true })
export const Switch = Webpack.getModule(Filters.byStrings('checkbox', 'animated.rect'), { searchExports: true })
export const Checkbox = Webpack.getModule(m => Filters.byKeys('BOX', 'ROUND')(m?.Shapes), { searchExports: true })
export const FormTitle = Webpack.getModule(Filters.byStrings('defaultMargin', 'errorMessage'), { searchExports: true })
export const FormText = Webpack.getModule(m => Filters.byKeys('DESCRIPTION', 'ERROR')(m?.Types), { searchExports: true })
export const Breadcrumbs = Webpack.getModule(m => Filters.byStrings('renderBreadcrumb')(m?.prototype?.render), { searchExports: true })
export const RadioGroup = Webpack.getModule(m => Filters.byKeys('NOT_SET', 'NONE')(m?.Sizes), { searchExports: true })
export const FormItem = Webpack.getModule(m => Filters.byStrings('titleId', 'errorId', 'setIsFocused')(m?.render), { searchExports: true })
export const Slider = Webpack.getModule(m => Filters.byKeys('stickToMarkers', 'initialValue')(m?.defaultProps), { searchExports: true })
export const ModalTransitionState = Webpack.getModule(Filters.byKeys('ENTERED', 'EXITED', 'HIDDEN'), { searchExports: true })
export const ReferencePositionLayer = Webpack.getModule(Filters.byPrototypeKeys('getHorizontalAlignmentStyle', 'nudgeLeftAlignment'), { searchExports: true })
export const SearchableSelect = Webpack.getModule(m => Filters.byStrings('searchable', 'select')(m?.render), { searchExports: true })
export const { Anchor } = Webpack.getByKeys('Anchor')

export const Dispatcher = Webpack.getByKeys('dispatch', 'subscribe')
export const AppViewKeyed = getWithKey(Filters.byStrings('CHANNEL_THREAD_VIEW', 'GUILD_DISCOVERY'))
export const Router = Object.assign(
  Webpack.getMangled(m => m?.computeRootMatch, {
    Router: m => m?.computeRootMatch,
    Route: m => Filters.byStrings('props.computedMatch', 'props.path')(m?.prototype?.render),
    Switch: m => Filters.byStrings('props.location', 'cloneElement')(m?.prototype?.render),
    matchPath: Filters.byStrings('strict', 'isExact'),
    useLocation: Filters.byRegex(/return \w+\(\w+\)\.location/),
    useParams: Filters.byStrings('.match', '.params')
  }, { searchExports: true, raw: true }),
  {
    Link: Webpack.getModule(m => Filters.byStrings('createHref', 'navigate')(m?.render), { searchExports: true })
  }
)
export const Transition = Webpack.getByKeys('ENTERING', 'EXITING', 'contextType')
export const CSSTransition = Webpack.getModule(m => m?.defaultProps?.classNames === '')
export const TransitionGroup = Webpack.getModule(m => Filters.byPrototypeKeys('handleExited')(m) && !m.childContextTypes, { searchExports: true })
export const TransitionGroupContext = new Transition({ children: createElement('div') }).render().type
export const Routes = Webpack.getModule(Filters.byKeys('CHANNEL_THREAD_VIEW', 'GUILD_DISCOVERY'), { searchExports: true })
export const Constants = {
  DEFAULT_MESSAGE_REQUEST_SIDEBAR_WIDTH: 650,
  Routes,
  Themes: Webpack.getByKeys('DARK', 'LIGHT')
}
export const StaticChannelRoute = Webpack.getModule(Filters.byKeys('ROLE_SUBSCRIPTIONS', 'CHANNEL_BROWSER'), { searchExports: true })
export const ContextMenuKeyed = getWithKey(Filters.byStrings('getContextMenu', 'isOpen'))
export const Flux = Webpack.getByKeys('Store', 'connectStores')
export const useStateFromStores = Webpack.getModule(Filters.byStrings('useStateFromStores'), { searchExports: true })
export const MenuSubmenuItemKeyed = getWithKey(Filters.byStrings('subMenuClassName', 'submenuPaddingContainer'))
export const MenuSubmenuListItemKeyed = getWithKey(Filters.byStrings('menuSubmenuProps', 'listClassName', 'submenuPaddingContainer'))
export const { updateTheme } = Webpack.getByKeys('updateTheme')
export const ThemeStore = Webpack.getStore('ThemeStore')
export const BasePopoutKeyed = getWithKey(m => m?.defaultProps?.loadingComponent)
export const PopoutCSSAnimatorKeyed = getWithKey(m => Filters.byKeys('TRANSLATE', 'SCALE')(m?.Types))
export const SpringTransitionPhases = Webpack.getModule(Filters.byKeys('ENTER', 'LEAVE'), { searchExports: true })
export const { Layer, appLayerContext } = getMangled(Filters.byDisplayName('AppLayer'), {
  Layer: Filters.byDisplayName('AppLayer'),
  appLayerContext: m => m?.Provider
})
export const ChannelMessageList = Webpack.getModule(m => Filters.byStrings('channel', 'messageDisplayCompact')(m?.type))
export const ChannelView = Webpack.getModule(m => Filters.byStrings('providedChannel')(m?.type))
export const StandardSidebarViewWrapper = Webpack.waitForModule(Filters.byPrototypeKeys('getPredicateSections', 'renderSidebar'))
export const StandardSidebarViewKeyed = getWithKey(Filters.byStrings('standardSidebarView', 'section'), { lazy: true })
export const ModalsKeyed = getWithKey(Filters.byStrings('modalKey', '"layer-"'))
export const LayersKeyed = getWithKey(Filters.byStrings('hasFullScreenLayer'))
export const ChannelStore = Webpack.getStore('ChannelStore')
export const { Easing } = Webpack.getByKeys('Easing')
export const SortedGuildStore = Webpack.getStore('SortedGuildStore')
export const { GuildChannelList } = getMangled(Filters.byStrings('favorites-channel-list'), { GuildChannelList: Filters.byStrings('getGuild', 'guildId') }, { withKeys: true })
export const GuildActionRow = Webpack.getModule(Filters.byKeys('GUILD_ROLE_SUBSCRIPTIONS', 'CHANNELS_AND_ROLES'), { searchExports: true })
export const PrivateChannelSortStore = Webpack.getStore('PrivateChannelSortStore')
export const { ChannelSectionStore, MESSAGE_REQUESTS_BASE_CHANNEL_ID } = getMangled(Filters.byStoreName('ChannelSectionStore'), {
  ChannelSectionStore: Filters.byStoreName('ChannelSectionStore'),
  MESSAGE_REQUESTS_BASE_CHANNEL_ID: m => typeof m === 'string'
})
export const ChatSidebarKeyed = getWithKey(Filters.byStrings('sidebarType', 'postSidebarWidth'))
export const ChatSidebarType = Webpack.getModule(Filters.byKeys('MessageRequestSidebar', 'ThreadSidebar'), { searchExports: true })
export const VoiceChannelViewKeyed = getWithKey(Filters.byStrings('shouldUseVoiceEffectsActionBar'))
export const CallChatSidebarKeyed = getWithKey(Filters.byStrings('CallChatSidebar'))
export const MessageRequestSidebar = Webpack.getByStrings('isMessageRequest', 'closeChannelSidebar')
export const SidebarType = Webpack.getModule(Filters.byKeys('VIEW_MESSAGE_REQUEST', 'VIEW_THREAD'), { searchExports: true })
export const useMessageRequestSidebarStateKeyed = getWithKey(Filters.byStrings('getSidebarState', 'VIEW_MESSAGE_REQUEST'))
export const App = Webpack.getByKeys('setEnableHardwareAcceleration', 'releaseChannel')
export const Message = Webpack.getModule(m => Filters.byStrings('must not be a thread starter message')(m?.type), { searchExports: true })
export const MessageDivider = Webpack.getModule(m => Filters.byStrings('divider', 'unreadPill')(m?.render))
export const ChatSearchSidebarKeyed = getWithKey(Filters.byStrings('getResultsState', 'searchAnalyticsId'))
export const { Select: SelectKeyed, SingleSelect: SingleSelectKeyed } = getMangled(Filters.byStrings('listbox', 'renderPopout', 'closeOnSelect'), {
  Select: Filters.byStrings('listbox', 'renderPopout', 'closeOnSelect'),
  SingleSelect: m => Filters.byStrings('value', 'onChange')(m) && !Filters.byStrings('isSelected')(m)
}, { withKeys: true })
export const SingleSelect = UnkeyedComponent(SingleSelectKeyed)
export const MembersModViewSidebarKeyed = getWithKey(Filters.byStrings('MEMBER_SAFETY_PAGE', 'closeGuildSidebar'), { lazy: true })
export const LayerActions = getMangled(Filters.byStrings('LAYER_PUSH', 'component'), {
  pushLayer: Filters.byStrings('"LAYER_PUSH"'),
  popLayer: Filters.byStrings('"LAYER_POP"'),
  popAllLayers: Filters.byStrings('"LAYER_POP_ALL"')
})
export const LayerStore = Webpack.getStore('LayerStore')
export const SettingsNotice = Webpack.waitForModule(Filters.byStrings('resetButton', 'EMPHASIZE_NOTICE'))
export const { Alert, AlertTypes } = getMangled(Filters.byStrings('messageType', 'iconDiv'), {
  Alert: Filters.byStrings('messageType', 'iconDiv'),
  AlertTypes: Filters.byKeys('WARNING', 'ERROR')
})
export const UserSettingsModal = Webpack.getByKeys('open', 'setSection', 'updateAccount')
export const { colors } = Webpack.getByKeys('colors', 'modules')
export const { ModalRoot, ModalSize, ModalHeader, ModalFooter, ModalContent } = Webpack.getMangled(
  Filters.bySource('MODAL', 'rootWithShadow'),
  {
    ModalRoot: Filters.byStrings('MODAL', 'rootWithShadow'),
    ModalSize: Filters.byKeys('MEDIUM', 'LARGE'),
    ModalHeader: Filters.byStrings('headerIdIsManaged', 'HORIZONTAL'),
    ModalFooter: Filters.byStrings('footerSeparator'),
    ModalContent: Filters.byStrings('content', 'scrollbarType')
  }
)
export const Button = Webpack.getModule(Filters.byKeys('Link', 'Sizes'), { searchExports: true })
export const Flex = Webpack.getByKeys('Direction', 'Justify', 'Child')
export const Parser = Webpack.getByKeys('defaultRules', 'parse').defaultRules
export const InviteEmbed = Webpack.getByStrings('Invite Button Embed', 'getInvite')
export const InviteStates = Webpack.getModule(Filters.byKeys('APP_NOT_OPENED', 'RESOLVING'), { searchExports: true })
export const InviteStore = Webpack.getStore('InviteStore')
export const TextInput = Webpack.getModule(m => Filters.byKeys('maxLength', 'type')(m?.defaultProps), { searchExports: true })
export const AppPanels = Webpack.getModule(m => Filters.byStrings('panels', 'ACCOUNT_PANEL')(m?.type), { searchExports: true })
export const { ImpressionNames } = Webpack.getByKeys('ImpressionNames')
export const GuildChannelRouteParams = Webpack.getModule(m => Filters.byStrings('escapeRegExp')(m?.guildId), { searchExports: true })
export const handleClick = Webpack.getModule(Filters.byStrings('sanitizeUrl', 'shouldConfirm'), { searchExports: true })
export const MenuItemKeyed = getWithKey(Filters.byStrings('dontCloseOnActionIfHoldingShiftKey', 'data-menu-item'))
export const ChannelItemKeyed = getWithKey(Filters.byStrings('shouldIndicateNewChannel', 'MANAGE_CHANNELS'))
export const VoiceChannelItemKeyed = getWithKey(Filters.byStrings('PLAYING', 'MANAGE_CHANNELS'))
export const StageVoiceChannelItemKeyed = getWithKey(Filters.byStrings('getStageInstanceByChannel', 'MANAGE_CHANNELS'))
export const { AppContext } = Webpack.getMangled(Filters.bySource('renderWindow', 'ownerDocument.defaultView'), { AppContext: m => m?.Provider })
export const Timeout = Webpack.getModule(m => Filters.byPrototypeKeys('isStarted', 'start', 'stop')(m) && Filters.byStrings('setTimeout')(m), { searchExports: true })
export const ChannelTextArea = Webpack.getModule(m => Filters.byStrings('CHANNEL_TEXT_AREA')(m?.type?.render))
export const ExpressionPicker = Webpack.getModule(m => Filters.byStrings('EXPRESSION_PICKER', 'positionContainer')(m?.type), { searchExports: true })
export const { useExpressionPickerStore: useExpressionPickerStoreKeyed } = getMangled(Webpack.getBySource('expression-picker-last-active-view'), {
  useExpressionPickerStore: Filters.byKeys('getState', 'setState')
}, { withKeys: true })
export const ChannelTextAreaButtons = Webpack.getModule(m => Filters.byStrings('buttons', 'sticker', 'gif')(m?.type), { searchExports: true })
export const ChannelAppLauncher = Webpack.getModule(m => Filters.byStrings('channelAppLauncher')(m?.type), { searchExports: true })
export const AppLauncherPopup = Webpack.getModule(m => Filters.byStrings('positionLayer', '"positionTargetRef"')(m?.type), { searchExports: true })
