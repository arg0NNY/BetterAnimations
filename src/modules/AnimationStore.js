import { parse } from '@/modules/animation/parser'
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
    this.container.setAttribute('data-baa-type', this.type)
    if (this.context) this.container.setAttribute('data-baa-overflow', this.context.overflow)
    if (this.module.type) this.container.setAttribute(`data-baa-${this.module.type}`, '')
  }

  initialize (callback, allowed, intersectWith = null) {
    if (!allowed || !this.node) {
      this.doneCallbackRef.await(done => {
        done?.()
        callback?.()
      })
      return false
    }

    if (!intersectWith) {
      callback?.()
      if (this.cancelled) return false
    }

    this.applyAttributes()

    requestAnimationFrame(() => {
      if (this.cancelled) {
        if (intersectWith) callback?.()
        return
      }

      const { animate, context } = this.module.getAnimation(
        this.type,
        { auto: this.auto?.current },
        {
          instance: this,
          container: this.container,
          element: this.node,
          anchor: typeof this.anchor === 'function'
            ? this.anchor()
            : (this.anchor?.current ?? this.anchor),
          intersectWith,
          isIntersected: !!intersectWith
        }
      )
      this.context = context

      const { wrapper, onBeforeBegin, accordion, instances, reset, pause, revert, finished }
        = parse(animate, context, this.module.buildOptions())

      this.wrapper = wrapper
      this.accordion = accordion
      this.instances = instances
      this.pause = pause
      this.revert = revert

      if (intersectWith && callback) {
        callback()
        if (this.cancelled) return
        reset() // Force anime to re-apply styles because cancel callback might have removed some (prevent element flashing on 1 frame)
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
    this.doneCallbackRef.current?.()
    this.destroy(dueToError)

    const callback = () => {
      this.wrapper?.remove()

      ;[].filter.call(this.container.attributes, a => a.name?.startsWith('data-baa'))
        .forEach(a => this.container.removeAttribute(a.name))

      this.revert?.()
      this.onDestroyed?.()
    }

    if (provideCallback) return callback
    this.callback = callback
  }

  computeTimeLimit () {
    return 5000 + (this.context.duration ?? 0)
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
      this.cancel(true)
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
    const callbacks = list.map(animation => animation.cancel(false, provideCallback)).filter(c => typeof c === 'function')
    if (provideCallback) return () => callbacks.forEach(c => c())
  }

  processAnimation (animation) {
    switch (animation.module.type) {
      case ModuleType.Reveal:
        const [conflict] = this.animations.filter(a => a.module.id === animation.module.id && a.node === animation.node)
        const intersect = (animation.raw?.id ?? null) === (conflict?.raw?.id ?? null) && animation.raw?.animation?.meta?.intersect

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
