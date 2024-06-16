import { buildAnimateAssets } from '@/modules/animation/parser'
import AnimationType from '@/enums/AnimationType'
import ModuleType from '@/enums/ModuleType'

class Animation {

  constructor (store, { module, type, container, node, auto, doneCallbackRef }) {
    this.store = store

    this.module = module
    this.type = type
    this.container = container
    this.node = node
    this.auto = auto
    this.doneCallbackRef = doneCallbackRef

    this.cancelled = false
    this.cancel = () => {
      this.cancelled = true
      this.destroy()
    }
  }

  initialize (callback, allowed) {
    if (!allowed || !this.node) {
      this.doneCallbackRef.await(done => {
        done?.()
        callback?.()
      })
      return false
    }

    this.node.style.display = '' // Removes the 'display: none !important' that is added by Suspense in Freeze

    const { animate, context } = this.module.getAnimation(
      this.type,
      this.auto ? { auto: this.auto } : {},
      { container: this.container, element: this.node }
    )

    const { execute, wrapper, onBeforeCreate, onBeforeDestroy, onDestroyed }
      = buildAnimateAssets(animate, context, this.module.buildOptions())

    onBeforeCreate?.()

    this.cancel = () => {
      onBeforeDestroy?.()
      onDestroyed?.()
      this.destroy()
      this.cancelled = true
    }

    requestAnimationFrame(() => {
      if (this.cancelled) return

      const { instances, onBeforeBegin, finished, pause } = execute()

      if (callback) {
        callback()
        instances.forEach(i => {
          // Force anime to re-apply styles because cancel callback might have removed some (prevent element flashing on 1 frame)
          const { paused } = i
          i.reset()
          i.paused = paused
        })
      }

      onBeforeBegin?.()

      this.container.setAttribute('data-animation-type', this.type)
      this.container.setAttribute('data-animation-overflow', context.overflow)
      if (this.module.type) this.container.setAttribute(`data-animation-${this.module.type}`, '')

      if (wrapper) this.node.before(wrapper)

      const createClear = cancel => (...args) => {
        onBeforeDestroy?.()

        pause()
        this.doneCallbackRef.current?.()
        this.destroy(...args)

        const callback = () => {
          wrapper?.remove()

          ;[].filter.call(this.container.attributes, a => a.name !== 'data-animation-container' && a.name?.startsWith('data-animation'))
            .forEach(a => this.container.removeAttribute(a.name))

          onDestroyed?.()
        }

        return cancel ? callback : requestAnimationFrame(callback)
      }

      this.cancel = createClear(true)
      const clear = createClear(false)

      finished
        .then(() => clear(false))
        .catch(e => {
          console.error(`Error during '${this.type}' animation execution:`, e)
          clear(true)
        })
    })

    return true
  }

  destroy (dueToError = false) {
    this.store.destroyAnimation(this, dueToError)
  }

}

export default new class AnimationStore {
  static SWITCH_COOLDOWN = 1000

  constructor () {
    this.animations = []
    this.switchCooldownUntil = 0
  }

  cooldown () {
    this.switchCooldownUntil = Date.now() + AnimationStore.SWITCH_COOLDOWN
  }
  isCooldown () {
    return this.switchCooldownUntil > Date.now()
  }

  cancelAnimations (animations) {
    const list = typeof animations === 'function' ? this.animations.filter(animations) : [].concat(animations)
    const callbacks = list.map(animation => animation.cancel()).filter(c => typeof c === 'function')
    return () => callbacks.forEach(c => c())
  }

  processAnimation (animation) {
    switch (animation.module.type) {
      case ModuleType.Reveal:
        return [
          this.cancelAnimations(a => a.module.id === animation.module.id && a.node === animation.node),
          true
        ]
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
    const [callback, allowed] = this.processAnimation(animation)
    if (!animation.initialize(callback, allowed)) return null

    this.animations.push(animation)
    return animation
  }

  destroyAnimation (animation, dueToError = false) {
    // TODO: Make specific actions if animation destroyed due to error
    this.removeAnimation(animation)
  }

  removeAnimation (animation) {
    const index = this.animations.indexOf(animation)
    if (index !== -1) this.animations.splice(this.animations.indexOf(animation), 1)
  }

}
