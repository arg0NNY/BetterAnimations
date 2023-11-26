import { Webpack } from '@/BdApi'

const Selectors = {
  ThreadSidebar: Webpack.getByKeys('chatLayerWrapper', 'chatTarget')
}

export default new Proxy(Selectors, {
  get (obj, prop) {
    return obj[prop] && new Proxy(obj[prop], {
      get (obj, prop) {
        return obj[prop]?.split(' ').filter(i => !!i).map(c => '.'+c).join('')
      }
    })
  }
})
