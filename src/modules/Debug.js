import Logger from '@/modules/Logger'
import { snapshotContext } from '@/utils/animations'
import { toPath, visualizeAddonPath } from '@/utils/json'
import { capitalize } from '@/utils/text'
import { sanitizeInjectable } from '@animation/schemas/SanitizeInjectableSchema'

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

  __log (type, message, ...data) {
    if (this.animation)
      return Logger.stylized(
        'Animation',
        type,
        `%c${this.animation.key} (${this.animationType}) %c[DEBUG]%c ` + message,
        'color: #B8AF5E;',
        'color: #6BA6FF;',
        '',
        ...data
      )

    return Logger[type]('Debug', message, ...data)
  }

  _log (message, ...data) { return this.__log('log', message, ...data) }
  _warn (message, ...data) { return this.__log('warn', message, ...data) }
  _error (message, ...data) { return this.__log('error', message, ...data) }

  _system (event, message = null, meta = {}, type = 'log') {
    return this[`_${type}`](
      `%c${event}%c` + (message ? `: ${message}` : ''),
      'font-weight: bold;',
      '',
      ...Object.entries(meta).flatMap(
        ([key, value]) => [`\n↪ ${capitalize(key)}:`, value]
      )
    )
  }

  _visualized (event, name, path, context, meta = {}, options = {}) {
    const { type, visPath = path, ...visOptions } = options
    const visualized = visualizeAddonPath(context.pack, visPath, visOptions)
    return this._system(
      event,
      `'${name}' at "${toPath(path)}"` + (visualized ? '\n' + visualized : ''),
      meta,
      type
    )
  }

  _inject (event, name, path, context, meta = {}, options = {}) {
    return this._visualized(event, name, path, context, meta, {
      visPath: path.concat('inject'),
      ...options
    })
  }

  debug (name, path, context, data) {
    return this._inject(
      'Debug',
      name, path, context,
      {
        context: snapshotContext(context),
        data: sanitizeInjectable(data)
      }
    )
  }

  invalidSelector (selector, path, context) {
    return this._visualized(
      'Invalid selector',
      selector, path, context,
      { context: snapshotContext(context) },
      { type: 'warn', pointAt: 'key' }
    )
  }

  inject (name, path, context, received, output = undefined) {
    if (!this.isEnabled) return () => {}

    const contextSnapshot = snapshotContext(context)

    const report = output => this._inject(
      'Inject parsed',
      name, path, context,
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

    return this._inject(
      'Lazy inject called',
      name, path, context,
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
        received: sanitizeInjectable(received)
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

  parseStart (stage, received, context) {
    if (!this.isEnabled) return

    return this._system(
      'Parsing started',
      stage,
      {
        context: snapshotContext(context),
        received: sanitizeInjectable(received)
      }
    )
  }

  parseEnd (stage, result, context) {
    if (!this.isEnabled) return

    return this._system(
      'Parsing completed',
      stage,
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
