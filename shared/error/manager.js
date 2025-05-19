
class ErrorManager {
  get name () { return 'ErrorManager' }

  registerError (error) {
    console.error(error)
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

export default ErrorManager
