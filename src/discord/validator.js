import * as DiscordModules from '@discord/modules'
import { _Classes } from '@discord/classes'
import Logger from '@logger'
import ErrorManager from '@error/manager'
import InternalError from '@error/structs/InternalError'

class Validator {
  get name() { return 'Validator' }

  constructor () {
    this.issues = new Map()
  }

  shouldSkip (module) {
    return module instanceof DiscordModules.Flux.Store
      || module === (DiscordModules.GatewaySocket ?? {})
  }

  collectIssues (modules) {
    const issues = []
    for (const [key, module] of Object.entries(modules)) {
      if (module === undefined || (Array.isArray(module) && module.includes(undefined)))
        issues.push([key, 'Unresolved module.'])
      else if (typeof module === 'object' && module !== null && !this.shouldSkip(module)) {
        const keys = Object.keys(module).filter(k => module[k] === undefined)
        if (keys.length) issues.push([key, `Unresolved module keys: ${keys.join(', ')}.`])
      }
    }
    return issues
  }

  buildMessage (name, issues = this.issues.get(name) ?? []) {
    return `Found ${issues.length} issue${issues.length > 1 ? 's' : ''} in ${name}:\n`
      + issues.map(([key, value]) => `  • ${key}: ${value}`).join('\n')
  }

  validateModules (name, modules) {
    Logger.info(this.name, `Validating ${name}...`)

    const issues = this.collectIssues(modules)

    if (!issues.length) {
      Logger.info(this.name, `No issues found in ${name}.`)
      return true
    }

    this.issues.set(name, issues)
    const message = this.buildMessage(name, issues)

    if (import.meta.env.MODE === 'development') {
      ErrorManager.registerInternalError(
        new InternalError(`${this.name}: ${message}`)
      )
    } else Logger.warn(this.name, message)

    return false
  }

  onStartup () {
    this.validateModules('DiscordModules', DiscordModules)
    this.validateModules('DiscordClasses', _Classes)
  }
}

export default new Validator
