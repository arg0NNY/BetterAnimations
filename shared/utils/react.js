
export function createAwaitableRef () {
  return new class {
    constructor () {
      this._current = null
      this._callbacks = []
    }
    get current () { return this._current }
    set current (value) {
      this._current = value
      this._callbacks.forEach(callback => callback(value))
      this._callbacks = []
    }
    await (callback) {
      this._callbacks.push(callback)
    }
  }
}

export function getRef (refLike) {
  return typeof refLike === 'function'
    ? refLike()
    : 'current' in (refLike ?? {})
      ? refLike.current
      : refLike
}

export function isLazyLoaded (component) {
  return component._payload._status !== -1
}

export function loadLazy (component) {
  try {
    return Promise.resolve(
      component._init(component._payload) // Throws Promise or returns module
    )
  } catch (promise) {
    return promise
  }
}
