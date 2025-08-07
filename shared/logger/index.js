import config from '@config'

export const LogTypes = {
  err: 'error',
  error: 'error',
  dbg: 'debug',
  debug: 'debug',
  log: 'log',
  warn: 'warn',
  info: 'info',
  group: 'group',
  groupCollapsed: 'groupCollapsed'
}

export default class Logger {

  static stacktrace (module, message, error) {
    console.error(`%c[${config.name}] %c[${module}]%c ${message}\n\n%c`, 'color: #3E82E5; font-weight: 700;', 'color: #3a71c1; font-weight: 700;', 'color: red; font-weight: 700;', 'color: red;', error)
  }

  static err (module, ...message) { Logger._log(module, message, 'error') }
  static error (module, ...message) { Logger._log(module, message, 'error') }
  static warn (module, ...message) { Logger._log(module, message, 'warn') }
  static info (module, ...message) { Logger._log(module, message, 'info') }
  static debug (module, ...message) { Logger._log(module, message, 'debug') }
  static log (module, ...message) { Logger._log(module, message) }

  static group (module, ...message) { Logger._log(module, message, 'group') }
  static groupCollapsed (module, ...message) { Logger._log(module, message, 'groupCollapsed') }
  static groupEnd () { console.groupEnd() }

  static stylized (module, type, message, ...entries) { Logger._log(module, entries, type, message) }

  static _log (module, message, type = 'log', after = '') {
    type = Logger.parseType(type)
    if (!Array.isArray(message)) message = [message]
    console[type](`%c[${config.name}]%c [${module}]%c` + (after ? ` ${after}` : ''), 'color: #3E82E5; font-weight: 700;', 'color: #3a71c1;', '', ...message)
  }

  static parseType (type) {
    return LogTypes[type] || 'log'
  }

}
