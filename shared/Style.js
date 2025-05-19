import config from '@config'

class Style {
  get name () { return 'Style' }
  get styleId () { return `${config.name}-style` }

  constructor () {
    this.initialized = false
    this.styles = []
  }

  initialize () {
    this.injectStyle()
    this.initialized = true
  }
  shutdown () {
    this.removeStyle()
    this.initialized = false
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

export default Style
