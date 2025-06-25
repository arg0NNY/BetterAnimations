import Patcher from '@/modules/Patcher'
import { popToastKeyed } from '@discord/modules'
import ErrorManager from '@error/manager'

function patchPopToast () {
  Patcher.instead(...popToastKeyed, (self, [force], original) => {
    if (force !== true && ErrorManager.isToastActive()) return
    return original()
  })
}

export default patchPopToast
