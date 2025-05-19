import Animation from '@animation'
import ModuleType from '@enums/ModuleType'
import Logger from '@logger'

export default class AnimationStore {
  get name () { return 'AnimationStore' }
  get switchCooldownDuration () { return 1000 }

  constructor () {
    this.animations = []
    this.switchCooldownUntil = 0

    this.onDocumentVisibilityChange = () => {
      if (document.hidden) this.cancelAllAnimations()
    }
  }

  initialize () {
    document.addEventListener('visibilitychange', this.onDocumentVisibilityChange)
    Logger.info(this.name, 'Initialized.')
  }
  shutdown () {
    document.removeEventListener('visibilitychange', this.onDocumentVisibilityChange)
    this.cancelAllAnimations()
    Logger.info(this.name, 'Shutdown.')
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
        const intersect = (animation.raw?.id ?? null) === (conflict?.raw?.id ?? null)
          && (!animation.raw?.id || animation.raw.meta?.intersect)

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
    if (index !== -1) this.animations.splice(this.animations.indexOf(animation), 1)
  }
}
