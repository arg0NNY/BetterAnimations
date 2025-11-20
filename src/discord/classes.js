import { Webpack } from '@/BdApi'

export const _Classes = {
  ChatSidebar: Webpack.getByKeys('chatLayerWrapper', 'chatTarget'),
  StandardSidebarView: () => Webpack.getByKeys('standardSidebarView', 'contentRegion'),
  SettingsSidebar: () => Webpack.getByKeys('sidebar', 'section', 'nav'),
  Modal: Webpack.getByKeys('root', 'rootWithShadow'),
  ModalBackdrop: Webpack.getByKeys('backdrop', 'withLayer'),
  Layers: Webpack.getByKeys('layer', 'baseLayer'),
  AppMount: Webpack.getByKeys('appMount'),
  AppView: Webpack.getByKeys('base', 'content'),
  ChannelView: Webpack.getByKeys('chat', 'chatContent'),
  VoiceChannelView: Webpack.getByKeys('channelChatWrapper', 'noChat'),
  ChannelItem: Webpack.getByKeys('containerDefault', 'channelInfo'),
  MessageList: Webpack.getByKeys('message', 'groupStart'),
  Layer: Webpack.getByKeys('layer', 'layerContainer'),
  Toast: Webpack.getByKeys('toast', 'icon'),
  Scroller: Webpack.getByKeys('thin', 'disableScrollAnchor'),
  Select: Webpack.getByKeys('select', 'measurement'),
  ManaModal: Webpack.getByKeys('actionBar', 'headerTrailing')
}

const DiscordClasses = new Proxy(_Classes, {
  get (obj, prop) {
    const value = obj[prop]
    if (typeof value !== 'function') return value

    const resolved = value()
    if (!resolved) return undefined

    return (obj[prop] = resolved)
  }
})

export default DiscordClasses
