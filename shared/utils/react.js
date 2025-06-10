
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
