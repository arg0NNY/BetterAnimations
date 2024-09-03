import { capitalize } from '@/helpers/text'

export default class AddonError extends Error {
  constructor (addon, message, error, type) {
    super(message)
    this.addon = addon
    this.error = error
    this.type = type
  }

  get name () {
    return `${capitalize(this.type)}Error (${this.addon.slug})`
  }
}
