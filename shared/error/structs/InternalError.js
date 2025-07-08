import BaseError from '@error/structs/BaseError'

export default class InternalError extends BaseError {
  static Category = {
    GENERAL: 0,
    MODULE: 1,
    PRIORITIZE_ANIMATION_SMOOTHNESS: 2,
    CACHE_USER_SETTINGS_SECTIONS: 3
  }

  constructor (message, { category, ...options } = {}) {
    super(message, options)
    this.category = category ?? InternalError.Category.GENERAL
  }

  get name () {
    return 'InternalError'
  }
}
