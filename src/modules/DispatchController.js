import { ChannelSectionStore, Dispatcher, Flux, SelectedChannelStore, SelectedGuildStore } from '@discord/modules'
import AnimationStore from '@animation/store'
import Logger from '@logger'
import Config from '@/modules/Config'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'
import ModuleType from '@enums/ModuleType'

const ignoredEvents = [
  'CHANNEL_SELECT'
]

const alwaysInterceptedEvents = [
  'GUILD_CREATE',
  'GUILD_MEMBER_LIST_UPDATE',
  'LOAD_MESSAGES_SUCCESS',
  'THREAD_LIST_SYNC'
]

class DispatchController {
  get name () { return 'DispatchController' }

  constructor () {
    this.queue = []
    this.isEmitterPaused = false
    this._selectedChannelId = null
    this._clearWatcher = null

    this.interceptor = event => {
      if (!AnimationStore.animations.length || this.isEmitterPaused) return
      if (import.meta.env.VITE_DISPATCH_CONTROLLER_DEBUG === 'true') this._debugEvent(event)
      if (!this.shouldIntercept(event)) return

      Logger.log(this.name, `Intercepted and queued ${event.type}.`)
      this.queue.push(event)
      return true // Block event
    }

    this.onSettingsChange = () => {
      if (this.isEnabled) {
        this.registerInterceptor()
        Logger.log(this.name, 'Enabled.')
      } else {
        this.clearInterceptor()
        this.flushQueue()
        Logger.log(this.name, 'Disabled.')
      }
    }

    this.onSelectedChannelStoreChange = () => {
      const channelId = SelectedChannelStore.getChannelId()
      if (channelId !== this._selectedChannelId) this.flushQueue()
      this._selectedChannelId = channelId
    }
  }

  _debugEvent (event) {
    Logger.log(this.name, `Event fired:`, event)
    console.time(event.type)
    requestAnimationFrame(() => console.timeEnd(event.type))
  }

  getVisibleEntities () {
    const guildId = SelectedGuildStore.getGuildId()
    const channelId = SelectedChannelStore.getChannelId(guildId)
    const threadId = ChannelSectionStore.getCurrentSidebarChannelId(channelId)
    return { guildId, channelId, threadId }
  }
  shouldIntercept (event) {
    if (ignoredEvents.includes(event.type)) return false
    if (alwaysInterceptedEvents.includes(event.type)) return true

    const { guildId, channelId, threadId } = this.getVisibleEntities()
    return (typeof event.guildId === 'string' && event.guildId !== guildId)
      || (typeof event.channelId === 'string' && event.channelId !== channelId && event.channelId !== threadId)
  }
  shouldPauseEmitter (animations = AnimationStore.animations) {
    return animations.some(a => a.module.type === ModuleType.Switch)
  }

  flushQueue () {
    if (!this.queue.length) return

    Logger.log(this.name, `Flushing ${this.queue.length} event${this.queue.length > 1 ? 's' : ''}:`, this.queue)
    Flux.Emitter.batched(() => {
      this.queue.forEach(event => Dispatcher.dispatch(event))
      this.queue = []
    })
  }

  get isEnabled () {
    return Config.current.general.prioritizeAnimationSmoothness
  }

  registerInterceptor () {
    if (Dispatcher._interceptors.includes(this.interceptor)) return
    Dispatcher._interceptors.unshift(this.interceptor)
  }
  clearInterceptor () {
    Dispatcher._interceptors = Dispatcher._interceptors.filter(i => i !== this.interceptor)
  }

  pauseEmitter () {
    if (this.isEmitterPaused) return

    this.isEmitterPaused = true
    Logger.log(this.name, 'Emitter paused.')
  }
  resumeEmitter () {
    if (!this.isEmitterPaused) return

    this.isEmitterPaused = false
    Flux.Emitter.emit()
    Logger.log(this.name, 'Emitter resumed.')
  }

  registerWatcher () {
    this._clearWatcher = AnimationStore.watch(animations => {
      if (this.isEnabled && this.shouldPauseEmitter(animations)) this.pauseEmitter()
      else this.resumeEmitter()

      if (!animations.length) this.flushQueue()
    })
  }
  clearWatcher () {
    this._clearWatcher?.()
  }

  watchSelectedChannel () {
    this._selectedChannelId = SelectedChannelStore.getChannelId()
    SelectedChannelStore.addChangeListener(this.onSelectedChannelStoreChange)
  }

  initialize () {
    if (this.isEnabled) this.registerInterceptor()
    this.registerWatcher()
    Emitter.on(Events.SettingsChanged, this.onSettingsChange)
    this.watchSelectedChannel()

    Logger.log(this.name, `Initialized${this.isEnabled ? ' and enabled' : ''}.`)
  }

  shutdown () {
    this.clearInterceptor()
    this.clearWatcher()
    Emitter.off(Events.SettingsChanged, this.onSettingsChange)
    SelectedChannelStore.removeChangeListener(this.onSelectedChannelStoreChange)

    this.flushQueue()

    Logger.log(this.name, 'Shutdown.')
  }
}

export default new DispatchController
