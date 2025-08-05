import Patcher, { TinyPatcher } from '@/modules/Patcher'
import { MenuItemKeyed } from '@discord/modules'

function patchMenuItem () {
  /**
   * Context Menu Item's `action` callback executes inside rAF by default,
   * which forces the animation to skip a frame before executing,
   * as it also uses rAF to schedule an execution, resulting in a flicker on the enter animations.
   * > rAF inside rAF schedules callback on the next frame, not on the current one.
   *
   * This patch intercepts Discord's rAF call and executes the callback synchronously instead.
   */
  Patcher.after(...MenuItemKeyed, (self, [props], value) => {
    if (!value.props.onClick) return

    TinyPatcher.before(value.props, 'onClick', (self, [event]) => {
      Object.defineProperty(event.nativeEvent, 'view', {
        value: new Proxy(event.nativeEvent.view, {
          get (target, prop) {
            if (prop === 'requestAnimationFrame') return cb => cb()
            return target[prop]
          }
        })
      })
    })
  })
}

export default patchMenuItem
