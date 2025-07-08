import { Flux, GatewaySocket } from '@discord/modules'
import Logger from '@logger'

class WebSocketController {
  get name () { return 'WebSocketController' }

  constructor () {
    this.queue = []
    this.isPaused = false
    this._messageHandler = null

    this.interceptor = message => {
      this.queue.push(message)
    }
  }

  getOriginalMessageHandler () {
    const handler = GatewaySocket.webSocket.onmessage
    return handler === this.interceptor ? this._messageHandler : handler
  }
  setMessageHandler (handler) {
    GatewaySocket.webSocket.onmessage = handler
  }

  get messageHandler () {
    return this._messageHandler ?? this.getOriginalMessageHandler()
  }

  flushQueue () {
    if (!this.queue.length || !this.messageHandler) return

    Logger.log(this.name, `Flushing ${this.queue.length} message${this.queue.length > 1 ? 's' : ''}.`)
    Flux.Emitter.batched(() => {
      this.queue.forEach(message => this.messageHandler(message))
      this.queue = []
    })
  }

  pauseMessages () {
    if (this.isPaused) return

    this._messageHandler = this.getOriginalMessageHandler()
    this.setMessageHandler(this.interceptor)
    this.isPaused = true
    Logger.log(this.name, 'Messages paused.')
  }
  resumeMessages (flush = true) {
    if (!this.isPaused) return

    this.setMessageHandler(this.messageHandler)
    this._messageHandler = null
    this.isPaused = false
    Logger.log(this.name, 'Messages resumed.')

    if (flush) this.flushQueue()
  }
}

export default WebSocketController
