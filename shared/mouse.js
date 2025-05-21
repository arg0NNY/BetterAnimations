import Logger from '@logger'

export class Mouse {
  get name () { return 'Mouse' }

  constructor ({ x, y } = { x: -1, y: -1 }) {
    this.x = x
    this.y = y

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
      this.x = window.innerWidth / 2
      this.y = window.innerHeight / 2
    }

    document.addEventListener('mousemove', this.onMouseMove)

    Logger.info(this.name, 'Initialized.')
    return this
  }

  shutdown () {
    document.removeEventListener('mousemove', this.onMouseMove)

    Logger.info(this.name, 'Shutdown.')
    return this
  }
}

export default new Mouse
