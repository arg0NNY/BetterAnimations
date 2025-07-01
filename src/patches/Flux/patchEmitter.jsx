import Patcher from '@/modules/Patcher'
import { Flux } from '@discord/modules'
import DispatchController from '@/modules/DispatchController'

function patchEmitter () {
  Patcher.instead(Flux.Emitter, 'emit', (self, args, original) => {
    if (DispatchController.isEmitterPaused) return
    return original.apply(self, args)
  })
}

export default patchEmitter
