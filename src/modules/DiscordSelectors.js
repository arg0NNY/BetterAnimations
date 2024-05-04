import { Webpack } from '@/BdApi'

// TODO: Add support for lazy loaded modules
const Classes = {
  ThreadSidebar: Webpack.getByKeys('chatLayerWrapper', 'chatTarget'),
  StandardSidebarView: () => Webpack.getByKeys('standardSidebarView', 'contentRegion'),
  Modal: Webpack.getByKeys('root', 'rootWithShadow'),
  Layer: Webpack.getByKeys('layer', 'baseLayer')
}

export const DiscordClasses = Classes
// export const DiscordClasses = new Proxy(Classes, {
//   get (obj, prop) {
//
//   }
// })

export const DiscordSelectors = new Proxy(Classes, {
  get (obj, prop) {
    return obj[prop] && new Proxy(obj[prop], {
      get (obj, prop) {
        return obj[prop]?.split(' ').filter(i => !!i).map(c => '.'+c).join('')
      }
    })
  }
})
