import DefaultTheme from 'vitepress/theme'
import './custom.css'

import InjectRef from '../../components/InjectRef.vue'
import { defineClientComponent } from 'vitepress'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('InjectRef', InjectRef)
    app.component('Lottie', defineClientComponent(
      async () => (await import('vue3-lottie')).Vue3Lottie
    ))
  }
}
