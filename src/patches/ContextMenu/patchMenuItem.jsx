import { Patcher } from '@/BdApi'
import { MenuItemKeyed } from '@/modules/DiscordModules'

function patchMenuItem () {
  /**
   * Context Menu Item's `action` callback executes inside rAF by default,
   * which forces the animation to skip a frame before executing,
   * as it also uses rAF to schedule an execution, resulting in a flicker on the enter animations.
   * > rAF inside rAF schedules callback on the next frame, not on the current one.
   *
   * This patch wraps the Menu Item callback in `requestIdleCallback`, which forces the callback to be executed outside the rAF.
   */
  Patcher.before(...MenuItemKeyed, (self, [props]) => {
    Patcher.instead(props, 'action', (self, args, original) => {
      requestIdleCallback(() => original(...args))
    })
  })
}

export default patchMenuItem
