import { Webpack } from '@/BdApi'

const { Filters } = Webpack

function avoidCommon (module) {
  return module === null || typeof module !== 'object' || Object.keys(module).length <= 100
}

export const LocaleStore = Webpack.getModule(m => m.Messages?.IMAGE)
export const Dispatcher = Webpack.getByKeys('dispatch', 'subscribe')
export const AppView = Webpack.getModule(m => Filters.byStrings('CHANNEL_THREAD_VIEW', 'GUILD_DISCOVERY')(m?.default))
export const Router = Webpack.getByKeys('BrowserRouter')
export const Transition = Webpack.getByKeys('ENTERING', 'EXITING')
export const { CSSTransition, TransitionGroup } = Webpack.getByKeys('CSSTransition', 'TransitionGroup')
export const Constants = Webpack.getByKeys('Permissions', 'ActivityTypes', 'StatusTypes')
export const { Routes } = Constants
export const { StaticChannelRoute } = Webpack.getByKeys('StaticChannelRoute')
export const ContextMenu = Webpack.getModule(m => Filters.byStrings('getContextMenu', 'isOpen')(m?.default))
export const Flux = Webpack.getByKeys('useStateFromStores')
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
