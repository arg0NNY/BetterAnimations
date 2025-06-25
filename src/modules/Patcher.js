import { Patcher as _Patcher } from '@/BdApi'
import { attempt, errorBoundary } from '@error/boundary'
import Modules from '@/modules/Modules'

export default new class Patcher {
  _patch (type, moduleId, moduleToPatch, functionName, callback, fallback) {
    if (typeof moduleId !== 'string') {
      [, moduleToPatch, functionName, callback, fallback] = arguments
      moduleId = null
    }

    const options = { module: moduleId && Modules.getModule(moduleId) }

    return attempt(() => _Patcher[type](
      moduleToPatch,
      functionName,
      errorBoundary(callback, fallback, options)
    ), options)
  }

  before (
    moduleId,
    moduleToPatch,
    functionName,
    callback,
    fallback
  ) {
    return this._patch('before', moduleId, moduleToPatch, functionName, callback, fallback)
  }

  after (
    moduleId,
    moduleToPatch,
    functionName,
    callback,
    fallback = (self, args, value) => value
  ) {
    return this._patch('after', moduleId, moduleToPatch, functionName, callback, fallback)
  }

  instead (
    moduleId,
    moduleToPatch,
    functionName,
    callback,
    fallback = (self, args, original) => original.apply(self, args)
  ) {
    return this._patch('instead', moduleId, moduleToPatch, functionName, callback, fallback)
  }

  unpatchAll () {
    return _Patcher.unpatchAll()
  }
}
