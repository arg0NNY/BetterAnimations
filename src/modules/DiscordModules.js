import { React, Webpack } from '@/BdApi'

const { Filters } = Webpack

function avoidCommon (module) {
  return module === null || typeof module !== 'object' || Object.keys(module).length <= 100
}

export const Common = Webpack.getByKeys('Button', 'ButtonSizes', 'Clickable', 'Dialog')
export const LocaleStore = Webpack.getModule(m => m.Messages?.IMAGE)
export const Dispatcher = Webpack.getByKeys('dispatch', 'subscribe')
export const AppView = Webpack.getModule(Filters.byStrings('CHANNEL_THREAD_VIEW', 'GUILD_DISCOVERY'), { defaultExport: false })
export const Router = Webpack.getByKeys('BrowserRouter')
export const Transition = Webpack.getByKeys('ENTERING', 'EXITING', 'contextType')
export const { CSSTransition, TransitionGroup } = Webpack.getByKeys('CSSTransition', 'TransitionGroup')
export const TransitionGroupContext = new Transition({ children: React.createElement('div') }, {}).render().type._context
export const Constants = Webpack.getByKeys('Permissions', 'ActivityTypes', 'StatusTypes')
export const { Routes } = Constants
export const { StaticChannelRoute } = Webpack.getByKeys('StaticChannelRoute')
export const ContextMenu = Webpack.getModule(Filters.byStrings('getContextMenu', 'isOpen'), { defaultExport: false })
export const Flux = Webpack.getByKeys('useStateFromStores', 'Store')
export const { useStateFromStores } = Flux
export const MenuSubmenuItem = Webpack.getByKeys('MenuSubmenuItem')
export const MenuSubmenuListItem = Webpack.getByKeys('MenuSubmenuListItem')
export const { updateTheme } = Webpack.getByKeys('updateTheme')
export const ThemeStore = Webpack.getStore('ThemeStore')
export const BasePopoutModule = Webpack.getModule(m => Filters.byKeys('BasePopout')(m) && avoidCommon(m))
export const PopoutCSSAnimator = Webpack.getModule(m => Filters.byKeys('PopoutCSSAnimator')(m) && avoidCommon(m))
export const { Tooltip, TooltipLayer } = Webpack.getModule(m => Filters.byKeys('Tooltip', 'TooltipLayer')(m) && avoidCommon(m))
export const { SpringTransitionPhases } = Webpack.getByKeys('SpringTransitionPhases')
export const { Layer } = Webpack.getByKeys('Layer', 'LayerProvider')
export const { appLayerContext } = Webpack.getByKeys('appLayerContext')
export const ChannelMessageList = Webpack.getModule(m => Filters.byStrings('channel', 'messageDisplayCompact')(m?.type))
export const ChannelView = Webpack.getModule(m => Filters.byStrings('providedChannel')(m?.type))
export const PropTypes = Webpack.getByKeys('PropTypes')
export const StandardSidebarViewWrapper = Webpack.waitForModule(Filters.byKeys('SHAKE_INTENSITY_DEFAULT'))
export const StandardSidebarView = Webpack.waitForModule(Filters.byKeys('SectionTypes', 'ContentTypes'))
export const Modals = Webpack.getModule(m => Filters.byKeys('Modals')(m) && avoidCommon(m))
export const ModalActions = Webpack.getModule(m => Filters.byKeys('closeAllModals', 'openModal')(m) && avoidCommon(m))
export const ModalBackdrop = Webpack.getByKeys('BackdropStyles')
export const ReactSpring = Webpack.getModule(m => m?.Spring && !m?.animated)
export const Layers = Webpack.getModule(Filters.byStrings('hasFullScreenLayer'), { defaultExport: false })
export const { ListThin } = Webpack.getModule(m => Filters.byKeys('ListThin')(m) && avoidCommon(m))
export const ChannelStore = Webpack.getByKeys('getChannel', 'getDMFromUserId')
export const VoiceChannelView = Webpack.getModule(Filters.byStrings('shouldUseVoiceEffectsActionBar'), { defaultExport: false })
export const History = Webpack.getByKeys('createBrowserHistory', 'createMemoryHistory')
export const { Easing } = Webpack.getByKeys('Easing')
export const SortedGuildStore = Webpack.getStore('SortedGuildStore')
export const GuildChannelList = Webpack.getByKeys('GuildChannelList')
export const GuildChannelStore = Webpack.getStore('GuildChannelStore')
export const { ChannelListCommunityRow } = Webpack.getByKeys('ChannelListCommunityRow')
export const PrivateChannelSortStore = Webpack.getStore('PrivateChannelSortStore')
