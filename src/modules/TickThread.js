import Logger from '@/modules/Logger'

export default new class TickThread {
  get name () { return 'TickThread' }

  constructor () {
    this.running = false
    this.callbacks = []
  }

  initialize () {
    this.running = true
    requestAnimationFrame(this.tick.bind(this))

    Logger.info(this.name, `Initialized with ${this.callbacks.length} callbacks.`)
  }

  tick (t) {
    if (!this.running) return

    this.callbacks.forEach(callback => callback(t))

    requestAnimationFrame(this.tick.bind(this))
  }

  shutdown () {
    this.running = false

    Logger.info(this.name, 'Shutdown.')
  }

  registerCallback (callback) {
    this.callbacks.push(callback)
  }
  removeCallback (callback) {
    this.callbacks = this.callbacks.filter(c => c !== callback)
  }

}
