import { DOM, Patcher } from '@/BdApi'
import forceAppUpdate from '@/helpers/forceAppUpdate'
import patchAppView from '@/patches/patchAppView'
import style from './style.css'
import animation from '../examples/example.animation.json'
import { fromZodError } from 'zod-validation-error'
import { buildAnimationAssets, parseAnimationData } from '@/modules/Animation/parser'
import { z } from 'zod'

export default function (meta) {
  try {
    const data = parseAnimationData(animation, {
      node: document.createElement('div'),
      type: 'enter',
      variant: 'up',
      duration: 500,
      easing: 'easeInOutQuad'
    })
    console.log(data)

    const assets = buildAnimationAssets(data.enter ?? data.animate)
    console.log(assets)
  }
  catch (e) {
    if (e instanceof z.ZodError) console.error('Failed to load animation: ' + fromZodError(e).message)
    else console.error('Failed to load animation: ' + e.message)
  }

  return {
    start () {
      DOM.addStyle('BA-test', style)

      patchAppView()
      forceAppUpdate()
    },
    stop () {
      Patcher.unpatchAll()
      DOM.removeStyle('BA-test')

      forceAppUpdate()
    }
  }
}
