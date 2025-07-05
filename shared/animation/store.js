import Animation from '@animation'
import ModuleType from '@enums/ModuleType'
import Logger from '@logger'

export class AnimationStore {
  get name () { return 'AnimationStore' }
  get switchCooldownDuration () { return 1000 }

  constructor () {
    this.animations = []
    this.switchCooldownUntil = 0

    this.shouldPauseEmitter = false
    this.shouldInterceptEvents = false
    this.isSafe = true
    this._watchers = []

    this.onDocumentVisibilityChange = () => {
      if (document.hidden) this.cancelAllAnimations()
      else this.trigger()
    }
  }

  initialize () {
    document.addEventListener('visibilitychange', this.onDocumentVisibilityChange)
  }
  shutdown () {
    document.removeEventListener('visibilitychange', this.onDocumentVisibilityChange)
    this.cancelAllAnimations()
  }

  cooldown () {
    this.switchCooldownUntil = Date.now() + this.switchCooldownDuration
  }
  isCooldown () {
    return this.switchCooldownUntil > Date.now()
  }

  cancelAnimations (animations, provideCallback = true) {
    const list = typeof animations === 'function' ? this.animations.filter(animations) : [].concat(animations)
    const callbacks = list.map(animation => animation.cancel(false, provideCallback)).filter(c => typeof c === 'function')
    const callback = (...args) => callbacks.forEach(c => c(...args))
    if (provideCallback) return callback
    else callback()
  }
  cancelAllAnimations () {
    return this.cancelAnimations(this.animations, false)
  }

  processAnimation (animation) {
    switch (animation.module.type) {
      case ModuleType.Reveal:
        const [conflict] = this.animations.filter(a => a.module.id === animation.module.id && a.element === animation.element)
        const intersect = (animation.data?.id ?? null) === (conflict?.data?.id ?? null)
          && (!animation.data?.id || animation.data.meta?.intersect)

        return [this.cancelAnimations(conflict ?? []), true, intersect ? conflict : null]
      case ModuleType.Switch: {
        if (this.isCooldown()) {
          this.cooldown()
          return [() => {}, false]
        }

        const conflicts = this.animations.filter(a => a.module.type === ModuleType.Switch)
        const isOverload = conflicts.some(a => a.type === animation.type)
        if (!isOverload) return [() => {}, true]

        this.cooldown()
        return [this.cancelAnimations(conflicts), false]
      }
    }
  }

  requestAnimation (payload) {
    const animation = new Animation(this, payload)
    const [callback, allowed, intersectWith = null] = this.processAnimation(animation)
    if (!animation.initialize(callback, allowed, intersectWith)) return null

    this.animations.push(animation)
    this.trigger()
    return animation
  }

  destroyAnimation (animation, dueToError = false) {
    if (dueToError && animation.module.type === ModuleType.Switch) {
      this.cooldown()
      this.cancelAnimations(this.animations.filter(a => a.module.type === ModuleType.Switch), false)
    }
    this.removeAnimation(animation)
  }

  removeAnimation (animation) {
    const index = this.animations.indexOf(animation)
    if (index === -1) return

    this.animations.splice(index, 1)
    this.trigger()
  }

  watch (callback) {
    this._watchers.push(callback)
    return () => this._watchers = this._watchers.filter(c => c !== callback)
  }
  untilSafe () {
    return new Promise(resolve => {
      if (this.isSafe) return resolve()

      const unwatch = this.watch((animations, isSafe) => {
        if (!isSafe) return
        unwatch()
        resolve()
      })
    })
  }

  trigger () {
    this.shouldPauseEmitter = this.animations.some(a => a.module.type === ModuleType.Switch)
    this.shouldInterceptEvents = this.animations.some(a => a.module.interceptEvents)
    this.isSafe = !this.animations.some(a => a.module.type === ModuleType.Switch)

    this._watchers.forEach(callback => {
      try { callback([...this.animations], this.isSafe) }
      catch (error) { Logger.warn(this.name, `Watcher threw an error:`, error) }
    })
  }
}

export default new AnimationStore
