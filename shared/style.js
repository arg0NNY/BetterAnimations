import config from '@config'
import Logger from '@logger'

export class Style {
  get name () { return 'Style' }
  get styleId () { return `${config.name}-style` }

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
    Logger.info(this.name, 'Shutdown.')
  }

  buildStyle () {
    return this.styles.reduce(
      (str, { description, style }) => str + `/* ====== ${description} ====== */\n${style}\n\n`,
      ''
    )
  }
  buildStyleElement (document = window.document) {
    const style = document.createElement('style')
    style.id = this.styleId
    style.appendChild(document.createTextNode(this.buildStyle()))
    return style
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

  injectStyle () {
    document.body.appendChild(this.buildStyleElement())
  }
  removeStyle () {
    document.getElementById(this.styleId)?.remove()
  }
}

export const createCSS =
  style =>
    (strings, ...values) =>
      description =>
        style.registerStyle(description, String.raw({ raw: strings }, ...values))

const style = new Style
export const css = createCSS(style)
export default style
