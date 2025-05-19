import BaseStyle, { createCSS } from '@shared/Style'
import { DOM } from '@/BdApi'
import Logger from '@logger'

const mainWindow = window

const Style = new class extends BaseStyle {
  initialize () {
    super.initialize()
    Logger.info(this.name, 'Initialized.')
  }
  shutdown () {
    super.shutdown()
    Logger.info(this.name, 'Shutdown.')
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

    super.updateStyle()
    Logger.log(this.name, 'Styles updated.')
  }

  ensureStyleForWindow (window) {
    const { document } = window
    if (!this.initialized || window === mainWindow || document.getElementById(this.styleId)) return

    document.body.appendChild(
      this.buildStyleElement(document)
    )
  }
}

export const css = createCSS(Style)

export default Style
