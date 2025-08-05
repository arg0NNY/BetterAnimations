import { BDPatcher } from '@/BdApi'
import { attempt, errorBoundary } from '@error/boundary'
import Core from '@/modules/Core'
import InternalError from '@error/structs/InternalError'

class BaseTinyPatcher {
  static before (moduleToPatch, functionName, callback) {
    const originalFunction = moduleToPatch[functionName]
    moduleToPatch[functionName] = function (...args) {
      callback(this, args)
      return originalFunction.apply(this, args)
    }
  }

  static after (moduleToPatch, functionName, callback) {
    const originalFunction = moduleToPatch[functionName]
    moduleToPatch[functionName] = function (...args) {
      const value = originalFunction.apply(this, args)
      const returnValue = callback(this, args, value)
      return returnValue !== undefined ? returnValue : value
    }
  }

  static instead (moduleToPatch, functionName, callback) {
    const originalFunction = moduleToPatch[functionName]
    moduleToPatch[functionName] = function (...args) {
      return callback(this, args, originalFunction.bind(this))
    }
  }

  static unpatchAll () {}
}

function getDefaultFallback (type) {
  switch (type) {
    case 'after': return (self, args, value) => value
    case 'instead': return (self, args, original) => original.apply(self, args)
    default: return () => undefined
  }
}

class PatcherWrapper {
  constructor (_basePatcher) {
    this._basePatcher = _basePatcher
  }

  _patch (type, moduleId, moduleToPatch, functionName, callback, options) {
    if (typeof moduleId !== 'string') {
      [, moduleToPatch, functionName, callback, options] = arguments
      moduleId = null
    }

    const { fallback = getDefaultFallback(type), ...rest } = options ?? {}

    const errorOptions = {
      module: moduleId && Core.getModule(moduleId),
      category: moduleId ? InternalError.Category.MODULE : InternalError.Category.GENERAL,
      ...rest
    }

    return attempt(() => {
      if (typeof moduleToPatch !== 'object' || typeof functionName !== 'string')
        throw new Error('Module received by Patcher is unresolved or invalid')

      return this._basePatcher[type](
        moduleToPatch,
        functionName,
        errorBoundary(callback, fallback, errorOptions)
      )
    }, () => {}, errorOptions)
  }

  before (moduleId, moduleToPatch, functionName, callback, options) {
    return this._patch('before', moduleId, moduleToPatch, functionName, callback, options)
  }

  after (moduleId, moduleToPatch, functionName, callback, options) {
    return this._patch('after', moduleId, moduleToPatch, functionName, callback, options)
  }

  instead (moduleId, moduleToPatch, functionName, callback, options) {
    return this._patch('instead', moduleId, moduleToPatch, functionName, callback, options)
  }

  unpatchAll () {
    return this._basePatcher.unpatchAll()
  }
}

export default new PatcherWrapper(BDPatcher)

export const TinyPatcher = new PatcherWrapper(BaseTinyPatcher)
