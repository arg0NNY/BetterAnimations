import BaseError from '@/structs/BaseError'
import { capitalize } from '@/helpers/text'

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
