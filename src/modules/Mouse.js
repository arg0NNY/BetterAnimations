import Logger from '@/modules/Logger'

export class Mouse {
  get name () { return 'Mouse' }

  constructor (window, log = false) {
    this.window = window
    this.log = log

    this.x = -1
    this.y = -1

    this.onMouseMove = e => {
      this.x = e.clientX
      this.y = e.clientY
    }
  }

  getAnchor () {
    return {
      x: this.x,
      y: this.y,
      width: 0,
      height: 0
    }
  }

  initialize () {
    if (this.x === -1 && this.y === -1) {
      this.x = this.window.innerWidth / 2
      this.y = this.window.innerHeight / 2
    }

    this.window.document.addEventListener('mousemove', this.onMouseMove)

    if (this.log) Logger.info(this.name, 'Initialized.')
    return this
  }

  shutdown () {
    this.window.document.removeEventListener('mousemove', this.onMouseMove)

    if (this.log) Logger.info(this.name, 'Shutdown.')
    return this
  }
}

export default new Mouse(window, true)
