import DefaultTheme from 'vitepress/theme'
import './custom.css'

import InjectRef from '../../components/InjectRef.vue'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('InjectRef', InjectRef)
  }
}
