import Patcher from '@/modules/Patcher'
import { popToastKeyed } from '@discord/modules'
import ErrorManager from '@error/manager'

function patchPopToast () {
  Patcher.instead(...popToastKeyed, (self, [key, force], original) => {
    if (key === 'APP' && force !== true && ErrorManager.isToastActive()) return
    return original(key)
  })
}

export default patchPopToast
