import config from '@/config.json'

const bdApi = new BdApi(config.name)

export const {
  Patcher,
  Webpack,
  Utils,
  DOM,
  React,
  ReactDOM,
  Data,
  Plugins,
  UI
} = bdApi

export default bdApi
