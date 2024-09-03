import Logger from '@/modules/Logger'

export default new class ErrorManager {
  get name () { return 'ErrorManager' }

  registerAddonError (error) {
    Logger.error(this.name, error)
  }

  registerAnimationError (error) {
    Logger.error(this.name, error)
  }
}
