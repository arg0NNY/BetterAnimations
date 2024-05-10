import { UI } from '@/BdApi'

export default class Notices {

  static info (content, options = {}) {return this.show(content, Object.assign({}, options, { type: 'info' }))}
  static warn (content, options = {}) {return this.show(content, Object.assign({}, options, { type: 'warning' }))}
  static error (content, options = {}) {return this.show(content, Object.assign({}, options, { type: 'error' }))}
  static success (content, options = {}) {return this.show(content, Object.assign({}, options, { type: 'success' }))}

  static show (content, options = {}) {
    return UI.showNotice(content, options)
  }

}
