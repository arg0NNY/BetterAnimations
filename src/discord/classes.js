import { Webpack } from '@/BdApi'

const Classes = {
  ChatSidebar: Webpack.getByKeys('chatLayerWrapper', 'chatTarget'),
  StandardSidebarView: () => Webpack.getByKeys('standardSidebarView', 'contentRegion'),
  Modal: Webpack.getByKeys('root', 'rootWithShadow'),
  ModalBackdrop: Webpack.getByKeys('backdrop', 'withLayer'),
  Layers: Webpack.getByKeys('layer', 'baseLayer'),
  Margins: Webpack.getByKeys('marginTop20', 'marginLeft8'),
  AppMount: Webpack.getByKeys('appMount'),
  AppView: Webpack.getByKeys('base', 'content'),
  ChannelView: Webpack.getByKeys('chat', 'chatContent'),
  VoiceChannelView: Webpack.getByKeys('channelChatWrapper', 'noChat'),
  ChannelItem: Webpack.getByKeys('containerDefault', 'channelInfo'),
  MessageList: Webpack.getByKeys('message', 'groupStart'),
  Layer: Webpack.getByKeys('layer', 'layerContainer'),
  Toast: Webpack.getByKeys('toast', 'icon'),
  Scroller: Webpack.getByKeys('thin', 'disableScrollAnchor'),
  Select: Webpack.getByKeys('select', 'measurement')
}

const DiscordClasses = new Proxy(Classes, {
  get (obj, prop) {
    const value = obj[prop]
    if (typeof value !== 'function') return value

    const resolved = value()
    if (!resolved) return undefined

    return (obj[prop] = resolved)
  }
})

export default DiscordClasses
