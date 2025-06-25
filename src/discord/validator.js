import * as DiscordModules from '@discord/modules'
import { _Classes } from '@discord/classes'
import Logger from '@logger'
import ErrorManager from '@error/manager'
import InternalError from '@error/structs/InternalError'

class Validator {
  get name() { return 'Validator' }

  shouldSkip (module) {
    if (module instanceof DiscordModules.Flux.Store) return true
    return false
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

  validateModules (name, modules) {
    Logger.info(this.name, `Validating ${name}...`)
    const issues = this.collectIssues(modules)
    if (!issues.length) {
      Logger.info(this.name, `No issues found in ${name}.`)
      return true
    }

    const message = `Found ${issues.length} issue${issues.length > 1 ? 's' : ''} in ${name}:\n`
      + issues.map(([key, value]) => `  • ${key}: ${value}`).join('\n')

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
