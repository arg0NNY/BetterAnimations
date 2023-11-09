import { DOM, Patcher } from '@/BdApi'
import forceAppUpdate from '@/helpers/forceAppUpdate'
import patchAppView from '@/patches/patchAppView'
import style from './style.css'

export default function (meta) {

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
