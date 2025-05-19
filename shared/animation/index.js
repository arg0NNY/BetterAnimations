import { getRect } from '@utils/position'
import isElement from 'lodash-es/isElement'
import { parse } from '@animation/parser'
import ErrorManager from '@error/manager'
import AnimationError from '@error/structs/AnimationError'

export default class Animation {
  constructor (store, { module, type, container, element, window, mouse, anchor, auto, doneCallbackRef }) {
    this.store = store

    this.module = module
    this.raw = module.animations[type]
    this.type = type
    this.container = container
    this.element = element
    this.window = window
    this.mouse = mouse
    this.anchor = anchor
    this.auto = auto
    this.doneCallbackRef = doneCallbackRef

    this.context = null

    this.timeout = null
    this.cancelled = false
  }

  applyAttributes () {
    this.container.setAttribute('data-baa-type', this.type)
    if ('overflow' in (this.context ?? {})) this.container.setAttribute('data-baa-overflow', this.context.overflow)
    if (this.module.type) this.container.setAttribute(`data-baa-${this.module.type}`, '')
  }

  initialize (callback, allowed, intersectWith = null) {
    if (
      !allowed
      || !this.element
      || (intersectWith && !intersectWith.instances)
      || this.window.document.hidden
    ) {
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
    const mouseAnchor = this.mouse.getAnchor()

    this.window.requestAnimationFrame(() => {
      if (this.cancelled) {
        if (intersectWith) callback?.()
        return
      }

      const anchor = typeof this.anchor === 'function'
        ? this.anchor()
        : 'current' in (this.anchor ?? {})
          ? this.anchor.current
          : this.anchor

      const { animate, context } = this.module.getAnimation(
        this.type,
        {
          auto: Object.assign(
            { mouse: mouseAnchor },
            this.auto?.current
          )
        },
        {
          instance: this,
          container: this.container,
          containerRect: getRect(this.container),
          element: this.element,
          window: this.window,
          document: this.window.document,
          mouse: this.mouse,
          anchor,
          anchorRect: isElement(anchor) ? getRect(anchor) : anchor,
          intersectWith,
          isIntersected: !!intersectWith
        }
      )
      this.context = context

      const { wrapper, onBeforeBegin, accordion, instances, finished }
        = parse(animate, context, this.module.buildOptions())

      this.wrapper = wrapper
      this.accordion = accordion
      this.instances = instances

      if (intersectWith && callback) {
        callback(false)
        if (this.cancelled) return
      }

      this.applyAttributes()

      onBeforeBegin?.()
      if (this.cancelled) return

      if (wrapper) this.element.before(wrapper)

      this.ensureTimeLimit()
      finished.then(() => this.cancel())
    })

    return true
  }

  cancel (dueToError = false, provideCallback = false) {
    if (this.cancelled) return
    this.cancelled = true

    this.onBeforeDestroy?.()

    this.instances?.pause()
    this.doneCallbackRef.current?.()
    this.destroy(dueToError)

    const callback = (revert = true) => {
      this.wrapper?.remove()

      ;[].filter.call(this.container.attributes, a => a.name?.startsWith('data-baa'))
        .forEach(a => this.container.removeAttribute(a.name))

      if (revert && ((this.context?.module.meta.revert ?? true) || this.context?.meta.revert)) this.instances?.revert()
      else this.instances?.cancel()

      this.onDestroyed?.()
    }

    if (provideCallback) return callback
    this.callback = callback
  }

  computeTimeLimit () {
    return 5000 + (this.context.duration ?? 0)
  }

  ensureTimeLimit (limit = this.computeTimeLimit()) {
    this.timeout = this.window.setTimeout(() => {
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
    this.window.clearTimeout(this.timeout)
    this.store.destroyAnimation(this, dueToError)
  }
}
