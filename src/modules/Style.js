import meta from '@/meta'
import { DOM } from '@/BdApi'
import Logger from '@/modules/Logger'

const Style = new class Style {
  get name () { return 'Style' }
  get styleId () { return `${meta.name}-style` }

  constructor () {
    this.initialized = false
    this.styles = []
  }

  initialize () {
    this.injectStyle()

    this.initialized = true
    Logger.info(this.name, 'Initialized.')
  }
  shutdown () {
    this.removeStyle()

    this.initialized = false
    Logger.info(this.name, 'Stopped.')
  }

  buildStyle () {
    return this.styles.reduce(
      (str, { description, style }) => str + `/* ====== ${description} ====== */\n${style}\n\n`,
      ''
    )
  }
  injectStyle () {
    Logger.log(this.name, `Injecting ${this.styles.length} registered styles...`)
    DOM.addStyle(this.styleId, this.buildStyle())
  }
  removeStyle () {
    Logger.log(this.name, 'Removing styles...')
    DOM.removeStyle(this.styleId)
  }
  updateStyle () {
    if (!this.initialized) return

    this.removeStyle()
    this.injectStyle()
    Logger.log(this.name, 'Styles updated.')
  }

  registerStyle (description, style) {
    this.styles.push({ description, style })
    this.updateStyle()
  }

}

export const css =
  (strings, ...values) =>
    description =>
      Style.registerStyle(description, String.raw({ raw: strings }, ...values))

export default Style
