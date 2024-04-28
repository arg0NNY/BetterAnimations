import { UI } from '@/BdApi'

export default class Toasts {

  static success (content, options = {}) {return this.show(content, Object.assign(options, { type: 'success' }))}
  static info (content, options = {}) {return this.show(content, Object.assign(options, { type: 'info' }))}
  static warning (content, options = {}) {return this.show(content, Object.assign(options, { type: 'warning' }))}
  static error (content, options = {}) {return this.show(content, Object.assign(options, { type: 'error' }))}
  static default (content, options = {}) {return this.show(content, Object.assign(options, { type: '' }))}

  static show (content, options = {}) {
    return UI.showToast(content, options)
  }
}
