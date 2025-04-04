import { Webpack } from '@/BdApi'
import Logger from '@/modules/Logger'

function avoidCommon (module) {
  return module === null || typeof module !== 'object' || Object.keys(module).length <= 100
}

export function mapModule (module, gettersMap, options = {}) {
  const { withKeys = false, avoidCommon: _avoidCommon = true } = options

  if (typeof module === 'function')
    module = Webpack.getModule(m => Object.values(m).some(module) && (!_avoidCommon || avoidCommon(m)))

  return module && Object.fromEntries(
    Object.entries(gettersMap)
      .map(([key, getter]) => {
        try {
          if (withKeys) return [key, [...Webpack.getWithKey(getter, { target: module })]]
          return [key, Object.values(module).find(getter)]
        } catch (err) {
          Logger.warn('DiscordModules', `Failed to map the given module with key ${key}:`, err)
          return [key, undefined]
        }
      })
  )
}

export function getMangled (filter, options = {}) {
  const { avoidCommon: _avoidCommon = true, lazy = false, ...rest } = options
  const predicate = m => Object.values(m).some(e => filter(e, m)) && (!_avoidCommon || avoidCommon(m))
  const findKey = module => module && Object.keys(module).find(k => filter(module[k], module))

  if (lazy) return new Promise(async resolve => {
    const module = await Webpack.waitForModule(predicate, rest)
    resolve([module, findKey(module)])
  })

  const module = Webpack.getModule(predicate, rest)
  return [module, findKey(module)]
}

export function unkeyed (keyed) {
  return keyed[0][keyed[1]]
}

export function UnkeyedComponent (keyedComponent) {
  return (...args) => unkeyed(keyedComponent)(...args)
}
