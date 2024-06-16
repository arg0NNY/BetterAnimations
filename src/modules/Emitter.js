import EventEmitter from 'events'

export default new class Emitter extends EventEmitter {
  dispatch (eventName, ...args) {
    this.emit(eventName, ...args)
  }
}
