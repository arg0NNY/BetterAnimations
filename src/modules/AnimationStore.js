import { buildAnimateAssets } from '@/modules/animation/parser'
import ModuleType from '@/enums/ModuleType'
import Config from '@/modules/Config'
import ErrorManager from '@/modules/ErrorManager'
import AnimationError from '@/structs/AnimationError'

class Animation {

  constructor (store, { module, type, container, node, anchor, auto, doneCallbackRef }) {
    this.store = store

    this.module = module
    this.raw = module.animations[type]
    this.type = type
    this.container = container
    this.node = node
    this.anchor = anchor
    this.auto = auto
    this.doneCallbackRef = doneCallbackRef

    this.context = null

    this.timeout = null
    this.cancelled = false
  }

  applyAttributes () {
    this.container.setAttribute('data-animation-type', this.type)
    if (this.context) this.container.setAttribute('data-animation-overflow', this.context.overflow)
    if (this.module.type) this.container.setAttribute(`data-animation-${this.module.type}`, '')
  }

  initialize (callback, allowed, intersect = false) {
    if (!allowed || !this.node) {
      this.doneCallbackRef.await(done => {
        done?.()
        callback?.()
      })
      return false
    }

    if (!intersect) {
      callback?.()
      if (this.cancelled) return false
    }

    this.applyAttributes()

    requestAnimationFrame(() => {
      if (this.cancelled) return

      const { animate, context } = this.module.getAnimation(
        this.type,
        { auto: this.auto?.current },
        {
          instance: this,
          container: this.container,
          element: this.node,
          anchor: this.anchor?.current ?? this.anchor,
          isIntersected: intersect
        }
      )
      this.context = context

      const { execute, wrapper, onBeforeCreate, onBeforeDestroy, onDestroyed }
        = buildAnimateAssets(animate, context, this.module.buildOptions())
      if (this.cancelled) return

      this.wrapper = wrapper
      this.onBeforeDestroy = onBeforeDestroy
      this.onDestroyed = onDestroyed

      onBeforeCreate?.()
      if (this.cancelled) return

      const { instances, onBeforeBegin, finished } = execute()
      if (this.cancelled) return

      if (intersect && callback) {
        callback()
        if (this.cancelled) return

        // Force anime to re-apply styles because cancel callback might have removed some (prevent element flashing on 1 frame)
        instances.forEach(i => {
          const { paused } = i
          i.reset()
          i.paused = paused
        })
      }

      this.applyAttributes()

      onBeforeBegin?.()
      if (this.cancelled) return

      if (wrapper) this.node.before(wrapper)

      this.ensureTimeLimit()
      finished.then(() => this.cancel())
    })

    return true
  }

  cancel (dueToError = false, provideCallback = false) {
    if (this.cancelled) return
    this.cancelled = true

    this.onBeforeDestroy?.()

    this.pause?.()
    if (this.instances) this.instances.length = 0
    this.doneCallbackRef.current?.()
    this.destroy(dueToError)

    const callback = () => {
      this.wrapper?.remove()

      ;[].filter.call(this.container.attributes, a => a.name !== 'data-animation-container' && a.name?.startsWith('data-animation'))
        .forEach(a => this.container.removeAttribute(a.name))

      this.onDestroyed?.()
    }

    if (provideCallback) return callback
    requestAnimationFrame(callback)
  }

  computeTimeLimit () {
    const { value = 0 } = this.context.duration ?? { value: 0 }
    return 5000 + value
  }

  ensureTimeLimit (limit = this.computeTimeLimit()) {
    this.timeout = setTimeout(() => {
      const { animation, module, pack, type } = this.context
      ErrorManager.registerAnimationError(
        new AnimationError(
          animation,
          `Animation exceeded the execution time limit (${(limit / 1000).toFixed(1)}s)`,
          { module, pack, type, context: this.context }
        )
      )
      this.destroy(true)
    }, limit)
  }

  destroy (dueToError = false) {
    clearTimeout(this.timeout)
    this.store.destroyAnimation(this, dueToError)
  }

}

export default new class AnimationStore {

  constructor () {
    this.animations = []
    this.switchCooldownUntil = 0
  }

  cooldown () {
    this.switchCooldownUntil = Date.now() + Config.current.general.switchCooldownDuration
  }
  isCooldown () {
    return this.switchCooldownUntil > Date.now()
  }

  cancelAnimations (animations, provideCallback = true) {
    const list = typeof animations === 'function' ? this.animations.filter(animations) : [].concat(animations)
    const callbacks = list.map(animation => animation.cancel(false, true)).filter(c => typeof c === 'function')
    const callback = () => callbacks.forEach(c => c())
    if (provideCallback) return callback
    requestAnimationFrame(callback)
  }

  processAnimation (animation) {
    switch (animation.module.type) {
      case ModuleType.Reveal:
        const conflicts = this.animations.filter(a => a.module.id === animation.module.id && a.node === animation.node)
        const intersect = conflicts.length === 1 && animation.raw?.id && animation.raw.id === conflicts[0].raw?.id
          && !animation.raw.animation?.meta?.disableSelfIntersect

        return [this.cancelAnimations(conflicts), true, intersect]
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
    const [callback, allowed, intersect = false] = this.processAnimation(animation)
    if (!animation.initialize(callback, allowed, intersect)) return null

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
