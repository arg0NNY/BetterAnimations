import config from '@config'

const bdApi = new BdApi(config.name)

export const {
  Patcher: BDPatcher,
  Webpack,
  Utils,
  DOM,
  Data: BDData,
  Plugins,
  UI,
  Net,
  ContextMenu
} = bdApi

export default bdApi
