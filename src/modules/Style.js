import { createCSS, Style } from '@shared/style'
import { DOM } from '@/BdApi'
import Logger from '@logger'

const style = new class extends Style {
  injectStyle () {
    Logger.log(this.name, `Injecting ${this.styles.length} registered styles...`)
    DOM.addStyle(this.styleId, this.buildStyle())
  }
  removeStyle () {
    Logger.log(this.name, 'Removing styles...')
    DOM.removeStyle(this.styleId)
  }
}

export const css = createCSS(style)

export default style
