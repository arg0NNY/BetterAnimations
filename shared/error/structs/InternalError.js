import BaseError from '@error/structs/BaseError'

export default class InternalError extends BaseError {
  constructor (message, options = {}) {
    super(message, options)
  }

  get name () {
    return 'InternalError'
  }
}
