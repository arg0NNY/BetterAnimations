import { events as EventEmitter } from '@/modules/Node'

export default new class Emitter extends EventEmitter {
  dispatch (eventName, ...args) {
    this.emit(eventName, ...args)
  }
}
