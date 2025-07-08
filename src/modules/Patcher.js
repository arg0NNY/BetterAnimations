import { Patcher as BDPatcher } from '@/BdApi'
import { attempt, errorBoundary } from '@error/boundary'
import Core from '@/modules/Core'
import InternalError from '@error/structs/InternalError'

function getDefaultFallback (type) {
  switch (type) {
    case 'after': return (self, args, value) => value
    case 'instead': return (self, args, original) => original.apply(self, args)
    default: return () => undefined
  }
}

export default new class Patcher {
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

    return attempt(() => BDPatcher[type](
      moduleToPatch,
      functionName,
      errorBoundary(callback, fallback, errorOptions)
    ), errorOptions)
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
    return BDPatcher.unpatchAll()
  }
}
