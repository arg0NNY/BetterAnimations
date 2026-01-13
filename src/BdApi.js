import config from '@config'

const bdApi = new BdApi(config.name)

export const {
  Patcher: BDPatcher,
  Webpack,
  Utils,
  ReactUtils,
  DOM,
  Data: BDData,
  Plugins,
  UI,
  Net,
  ContextMenu,
  Themes,
  version: bdVersion
} = bdApi

export default bdApi
