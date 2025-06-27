import { Dispatcher } from '@discord/modules'
import AnimationStore from '@animation/store'
import Logger from '@logger'

const interceptableEvents = [
  'GUILD_CREATE',
  'GUILD_MEMBER_LIST_UPDATE',
  'UPDATE_CHANNEL_LIST_DIMENSIONS',
  'THREAD_LIST_SYNC'
]

class DispatchController {
  get name () { return 'DispatchController' }

  constructor () {
    this.queue = []
    this._clearWatcher = null

    this.interceptor = event => {
      if (!AnimationStore.animations.length) return
      if (import.meta.env.VITE_DISPATCH_CONTROLLER_DEBUG === 'true') this._debugEvent(event)
      if (!this.shouldIntercept(event)) return

      Logger.log(this.name, `Intercepted and queued ${event.type}.`)
      this.queue.push(event)
      return true
    }
  }

  _debugEvent (event) {
    Logger.log(this.name, `Event fired:`, event)
    console.time(event.type)
    requestAnimationFrame(() => console.timeEnd(event.type))
  }

  shouldIntercept (event) {
    if (typeof event.type !== 'string') return false

    return event.type === 'GUILD_MEMBER_ADD' // Check for GUILD_MEMBER_ADD as soon as possible, as this event may sometimes fire dozens of times in a row
      || interceptableEvents.includes(event.type)
      || event.type.includes('MESSAGE')
  }

  flushQueue () {
    if (!this.queue.length) return

    Logger.log(this.name, `Flushing ${this.queue.length} event${this.queue.length > 1 ? 's' : ''}:`, this.queue)
    this.queue.forEach(event => Dispatcher.dispatch(event))
    this.queue = []
  }

  registerInterceptor () {
    Dispatcher.addInterceptor(this.interceptor)
  }
  clearInterceptor () {
    Dispatcher._interceptors = Dispatcher._interceptors.filter(i => i !== this.interceptor)
  }

  registerWatcher () {
    this._clearWatcher = AnimationStore.watch(animations => {
      if (!animations.length) this.flushQueue()
    })
  }
  clearWatcher () {
    this._clearWatcher?.()
  }

  initialize () {
    this.registerInterceptor()
    this.registerWatcher()

    Logger.log(this.name, 'Initialized.')
  }

  shutdown () {
    this.clearInterceptor()
    this.clearWatcher()

    Logger.log(this.name, 'Shutdown.')
  }
}

export default new DispatchController
