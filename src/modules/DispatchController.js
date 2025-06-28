import { Dispatcher, Flux } from '@discord/modules'
import AnimationStore from '@animation/store'
import Logger from '@logger'
import Config from '@/modules/Config'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'

const interceptableEvents = [
  'GUILD_CREATE',
  'GUILD_MEMBER_LIST_UPDATE',
  'UPDATE_CHANNEL_LIST_DIMENSIONS',
  'LOAD_MESSAGES_SUCCESS',
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

    this.onSettingsChange = () => {
      if (this.isEnabled()) {
        this.registerInterceptor()
        Logger.log(this.name, 'Enabled.')
      } else {
        this.clearInterceptor()
        this.flushQueue()
        Logger.log(this.name, 'Disabled.')
      }
    }
  }

  _debugEvent (event) {
    Logger.log(this.name, `Event fired:`, event)
    console.time(event.type)
    requestAnimationFrame(() => console.timeEnd(event.type))
  }

  shouldIntercept (event) {
    return interceptableEvents.includes(event.type)
  }

  flushQueue () {
    if (!this.queue.length) return

    Logger.log(this.name, `Flushing ${this.queue.length} event${this.queue.length > 1 ? 's' : ''}:`, this.queue)
    Flux.Emitter.batched(() => {
      this.queue.forEach(event => Dispatcher.dispatch(event))
      this.queue = []
    })
  }

  isEnabled () {
    return Config.current.general.prioritizeAnimationSmoothness
  }

  registerInterceptor () {
    if (Dispatcher._interceptors.includes(this.interceptor)) return
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
    if (this.isEnabled()) this.registerInterceptor()
    this.registerWatcher()
    Emitter.on(Events.SettingsChanged, this.onSettingsChange)

    Logger.log(this.name, `Initialized${this.isEnabled() ? ' and enabled' : ''}.`)
  }

  shutdown () {
    this.clearInterceptor()
    this.clearWatcher()
    Emitter.off(Events.SettingsChanged, this.onSettingsChange)
    this.flushQueue()

    Logger.log(this.name, 'Shutdown.')
  }
}

export default new DispatchController
