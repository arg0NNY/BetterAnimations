import { BDData } from '@/BdApi'

const Data = new Proxy({}, {
  get (_, name) {
    return BDData.load(name)
  },
  set (_, name, value) {
    BDData.save(name, structuredClone(value))
    return true
  }
})

export const cacheDataKey = 'cache'
export const Cache = new Proxy({}, {
  get (_, name) {
    return Data[cacheDataKey]?.[name]
  },
  set (_, name, value) {
    Data[cacheDataKey] = {
      ...Data[cacheDataKey],
      [name]: value
    }
    return true
  }
})

export default Data
