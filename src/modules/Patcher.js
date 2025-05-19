import { Patcher as _Patcher } from '@/BdApi'
import config from '@config'
import ErrorManager from '@/modules/ErrorManager'
import InternalError from '@/structs/InternalError'

function patcherCallbackBoundary (callback, fallback = (self, args, value) => value) {
  return (...args) => {
    try {
      return callback(...args)
    }
    catch (error) {
      ErrorManager.registerInternalError(
        new InternalError(error.stack)
      )
    }
    return fallback(...args)
  }
}

export default new class Patcher {
  before (moduleToPatch, functionName, callback) {
    return _Patcher.before(
      moduleToPatch,
      functionName,
      patcherCallbackBoundary(callback)
    )
  }

  after (moduleToPatch, functionName, callback) {
    return _Patcher.after(
      moduleToPatch,
      functionName,
      patcherCallbackBoundary(callback)
    )
  }

  instead (moduleToPatch, functionName, callback) {
    return _Patcher.instead(
      moduleToPatch,
      functionName,
      patcherCallbackBoundary(callback, (self, args, original) => original.call(self, args))
    )
  }

  unpatchAll () {
    return _Patcher.unpatchAll()
  }
}(config.name)
