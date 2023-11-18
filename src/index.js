import style from './style.css'
import { DOM, Patcher } from '@/BdApi'
import { forceAppUpdate } from '@/helpers/forceUpdate'
import patchAppView from '@/patches/AppView/patchAppView'
import patchContextMenu from '@/patches/ContextMenu/patchContextMenu'

export default function (meta) {

  return {
    start () {
      DOM.addStyle('BA-test', style)

      patchAppView()
      patchContextMenu()

      forceAppUpdate()
    },
    stop () {
      Patcher.unpatchAll()
      DOM.removeStyle('BA-test')

      forceAppUpdate()
    }
  }
}
