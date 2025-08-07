import Logger from '@logger'

export class ErrorManager {
  get name () { return 'ErrorManager' }

  constructor () {
    this.registerInternalError = error => this.registerError(error)
    this.registerAddonError = error => this.registerError(error)
    this.registerAnimationError = error => this.registerError(error)
  }

  registerError (error) {
    Logger.error(this.name, error)
  }
}

export default new ErrorManager
