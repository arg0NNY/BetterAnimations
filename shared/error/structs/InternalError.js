import BaseError from '@error/structs/BaseError'
import Validator from '@discord/validator'

export default class InternalError extends BaseError {
  static Category = {
    GENERAL: 0,
    MODULE: 1,
    PRIORITIZE_ANIMATION_SMOOTHNESS: 2,
    CACHE_USER_SETTINGS_SECTIONS: 3
  }

  constructor (message, { category, ...options } = {}) {
    const meta = []

    if (Validator.issues.has('DiscordModules'))
      meta.push(`${Validator.name}: ${Validator.buildMessage('DiscordModules')}`)

    super(message, options, meta)
    this.category = category ?? InternalError.Category.GENERAL
  }

  get name () {
    return 'InternalError'
  }
}
