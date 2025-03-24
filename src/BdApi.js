import config from '@/config.json'

const bdApi = new BdApi(config.name)

export const {
  Patcher,
  Webpack,
  Utils,
  DOM,
  Data,
  Plugins,
  UI,
  Net
} = bdApi

export default bdApi
