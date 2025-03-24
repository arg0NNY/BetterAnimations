import Logger from '@/modules/Logger'
import { sanitizeInjectable, snapshotContext } from '@/utils/animations'
import { toPath, visualizeAddonPath } from '@/utils/json'
import { capitalize } from '@/utils/text'

export default class Debug {
  constructor ({ animation, animationType }) {
    this.animation = animation
    this.animationType = animationType
  }

  static animation (animation, type) {
    return new Debug({ animation, animationType: type })
  }

  get isEnabled () {
    if (this.animation)
      return [true, this.animationType].includes(this.animation.debug)

    return import.meta.env.MODE === 'development'
  }

  _log (message, ...data) {
    if (this.animation)
      return Logger.stylized(
        'Animation',
        'log',
        `%c${this.animation.key} (${this.animationType}) %c[DEBUG]%c ` + message,
        'color: #B8AF5E;',
        'color: #6BA6FF;',
        '',
        ...data
      )

    return Logger.log('Debug', message, ...data)
  }

  _system (event, message = null, meta = {}) {
    return this._log(
      `%c${event}%c` + (message ? `: ${message}` : ''),
      'font-weight: bold;',
      '',
      ...Object.entries(meta).flatMap(
        ([key, value]) => [`\n↪ ${capitalize(key)}:`, value]
      )
    )
  }

  debug (name, path, context, data) {
    return this._system(
      'Debug',
      `'${name}' at "${toPath(path)}"\n`
      + visualizeAddonPath(context.pack, path.concat('inject')),
      {
        context: snapshotContext(context),
        data: sanitizeInjectable(data)
      }
    )
  }

  inject (name, path, context, received, output = undefined) {
    if (!this.isEnabled) return () => {}

    const contextSnapshot = snapshotContext(context)

    const report = output => this._system(
      'Inject parsed',
      `'${name}' at "${toPath(path)}"\n`
      + visualizeAddonPath(context.pack, path.concat('inject')),
      {
        context: contextSnapshot,
        received: sanitizeInjectable(received),
        output: sanitizeInjectable(output)
      }
    )

    return output ? report(output) : report
  }

  lazyInjectCall (name, path, args, context) {
    if (!this.isEnabled) return

    return this._system(
      'Lazy inject called',
      `'${name}' at "${toPath(path)}"\n`
      + visualizeAddonPath(context.pack, path.concat('inject')),
      {
        context: snapshotContext(context),
        arguments: args
      }
    )
  }

  initializeStart (received, context) {
    if (!this.isEnabled) return

    return this._system(
      'Initializing started',
      null,
      {
        context: snapshotContext(context),
        received
      }
    )
  }

  initializeEnd (result, context) {
    if (!this.isEnabled) return

    return this._system(
      'Initializing completed',
      null,
      {
        context: snapshotContext(context),
        result: sanitizeInjectable(result)
      }
    )
  }

  parseStart (received, context) {
    if (!this.isEnabled) return

    return this._system(
      'Parsing started',
      null,
      {
        context: snapshotContext(context),
        received: sanitizeInjectable(received)
      }
    )
  }

  parseEnd (result, context) {
    if (!this.isEnabled) return

    return this._system(
      'Parsing completed',
      null,
      {
        context: snapshotContext(context),
        result: sanitizeInjectable(result)
      }
    )
  }

  hook (name, context) {
    if (!this.isEnabled) return

    return this._system(
      'Hook triggered',
      name,
      { context: snapshotContext(context) }
    )
  }
}
