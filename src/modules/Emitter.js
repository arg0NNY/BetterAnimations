import EventEmitter from 'events'

export default new class Events extends EventEmitter {
  constructor () {
    super()
    this.setMaxListeners(20)
  }

  dispatch (eventName, ...args) {
    this.emit(eventName, ...args)
  }
}
