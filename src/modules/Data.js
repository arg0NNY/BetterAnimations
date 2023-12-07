import { Data } from '@/BdApi'

export default new Proxy({}, {
  get (_, name) {
    return Data.load(name)
  },
  set (_, name, value) {
    Data.save(name, value)
  }
})
