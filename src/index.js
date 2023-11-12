import { DOM, Patcher } from '@/BdApi'
import forceAppUpdate from '@/helpers/forceAppUpdate'
import patchAppView from '@/patches/patchAppView'
import style from './style.css'
import AnimationSchema from '@/modules/Animation/schemas/AnimationSchema'
import animation from '../examples/example.animation.json'
import { fromZodError } from 'zod-validation-error'

export default function (meta) {
  const parsed = AnimationSchema({
    node: 'NODE!',
    type: 'enter',
    variant: 'up',
    availableVariants: animation.settings?.variant?.map(v => v.key),
    hasDuration: !!animation.settings?.duration,
    duration: 500,
    hasEasing: !!animation.settings?.easing,
    easing: 'easeInOutQuad'
  })
    .safeParse(animation)
  console.log(
    parsed?.data,
    parsed.error && fromZodError(parsed.error).message
  )

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
