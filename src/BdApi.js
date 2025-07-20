import config from '@config'

const bdApi = new BdApi(config.name)

export const {
  Patcher,
  Webpack,
  Utils,
  DOM,
  Data,
  Plugins,
  UI,
  Net,
  ContextMenu
} = bdApi

export default bdApi
