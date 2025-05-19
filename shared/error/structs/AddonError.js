import BaseError from '@error/structs/BaseError'
import { capitalize } from '@utils/text'

export default class AddonError extends BaseError {
  constructor (type, addon, message, options = {}) {
    super(message, {
      [type]: addon,
      ...options
    })
    this.type = type
    this.addon = addon
  }

  get name () {
    return `${capitalize(this.type)}Error`
  }
}
