import Logger from '@logger'

export class ErrorManager {
  get name () { return 'ErrorManager' }

  registerError (error) {
    Logger.error(this.name, error)
  }
  registerInternalError (error) {
    this.registerError(error)
  }
  registerAddonError (error) {
    this.registerError(error)
  }
  registerAnimationError (error) {
    this.registerError(error)
  }
}

export default new ErrorManager
