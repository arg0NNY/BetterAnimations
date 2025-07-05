import {
  ChannelSectionStore,
  Dispatcher,
  Flux,
  LayerStore,
  SelectedChannelStore,
  SelectedGuildStore
} from '@discord/modules'
import AnimationStore from '@animation/store'
import Logger from '@logger'
import Config from '@/modules/Config'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'
import ModuleType from '@enums/ModuleType'
import isEqual from 'lodash-es/isEqual'
import WebSocketController from '@/modules/WebSocketController'

const ignoredEvents = [
  'CHANNEL_SELECT',
  'UPDATE_CHANNEL_DIMENSIONS'
]

const alwaysInterceptedEvents = [
  'GUILD_CREATE',
  'GUILD_MEMBER_LIST_UPDATE',
  'LOAD_MESSAGES_SUCCESS',
  'THREAD_LIST_SYNC'
]

const connectedStores = [
  SelectedGuildStore,
  SelectedChannelStore,
  ChannelSectionStore,
  LayerStore
]

class DispatchController {
  get name () { return 'DispatchController' }
  get isEnabled () { return Config.current.general.prioritizeAnimationSmoothness }

  constructor () {
    this.webSocketController = new WebSocketController()

    this.queue = []
    this.isEmitterPaused = false
    this._visibleEntities = this.getVisibleEntities()
    this._clearWatcher = null

    this.interceptor = event => {
      if (!AnimationStore.shouldInterceptEvents || this.isEmitterPaused) return
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
        this.webSocketController.resumeMessages(false)
        this.resumeEmitter()
        this.flushQueue()
        Logger.log(this.name, 'Disabled.')
      }
    }

    this.onConnectedStoreChange = () => {
      const visibleEntities = this.getVisibleEntities()
      if (!isEqual(visibleEntities, this._visibleEntities)) this.flushQueue()
      this._visibleEntities = visibleEntities
    }
  }

  _debugEvent (event) {
    Logger.log(this.name, `Event fired:`, event)
    console.time(event.type)
    requestAnimationFrame(() => console.timeEnd(event.type))
  }

  getVisibleEntities () {
    if (LayerStore.hasLayers()) return { guildId: null, channelId: null, threadId: null }

    const guildId = SelectedGuildStore.getGuildId()
    const channelId = SelectedChannelStore.getChannelId(guildId)
    const threadId = ChannelSectionStore.getCurrentSidebarChannelId(channelId)
    return { guildId, channelId, threadId }
  }
  shouldIntercept (event) {
    if (ignoredEvents.includes(event.type)) return false
    if (alwaysInterceptedEvents.includes(event.type)) return true

    const { guildId, channelId, threadId } = this._visibleEntities
    return (typeof event.guildId === 'string' && event.guildId !== guildId)
      || (typeof event.channelId === 'string' && event.channelId !== channelId && event.channelId !== threadId)
  }

  flushQueue () {
    this.webSocketController.flushQueue()

    if (!this.queue.length) return

    Logger.log(this.name, `Flushing ${this.queue.length} event${this.queue.length > 1 ? 's' : ''}:`, this.queue)
    Flux.Emitter.batched(() => {
      this.queue.forEach(event => Dispatcher.dispatch(event))
      this.queue = []
    })
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
    this._clearWatcher = AnimationStore.watch(() => {
      if (this.isEnabled && AnimationStore.shouldPauseEmitter) {
        this.webSocketController.pauseMessages()
        this.pauseEmitter()
      }
      else {
        this.webSocketController.resumeMessages()
        this.resumeEmitter()
      }

      if (!AnimationStore.shouldInterceptEvents) this.flushQueue()
    })
  }
  clearWatcher () {
    this._clearWatcher?.()
  }

  connectStores () {
    connectedStores.forEach(
      store => store.addChangeListener(this.onConnectedStoreChange)
    )
  }
  disconnectStores () {
    connectedStores.forEach(
      store => store.removeChangeListener(this.onConnectedStoreChange)
    )
  }

  initialize () {
    if (this.isEnabled) this.registerInterceptor()
    this.registerWatcher()
    this.connectStores()
    Emitter.on(Events.SettingsChanged, this.onSettingsChange)

    Logger.log(this.name, `Initialized${this.isEnabled ? ' and enabled' : ''}.`)
  }

  shutdown () {
    this.clearInterceptor()
    this.clearWatcher()
    this.disconnectStores()
    Emitter.off(Events.SettingsChanged, this.onSettingsChange)

    this.webSocketController.resumeMessages(false)
    this.resumeEmitter()
    this.flushQueue()

    Logger.log(this.name, 'Shutdown.')
  }
}

export default new DispatchController
