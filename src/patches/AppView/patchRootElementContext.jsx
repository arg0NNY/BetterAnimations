import Patcher from '@/modules/Patcher'
import { useRootElementContextKeyed } from '@discord/modules'
import Modules from '@/modules/Modules'
import classNames from 'classnames'

/**
 * Inject module indicator classes in the root element for easy theme compatibility
 *
 * NOTE: We can't use hooks here since `useRootElementContext` is not covered by `forceAppUpdate`,
 * but it's updated regularly by itself, so there's no real need to add settings listeners here.
 */
function patchRootElementContext () {
  Patcher.after(...useRootElementContextKeyed, (self, args, value) => {
    return {
      ...value,
      className: classNames(
        value.className,
        Modules.getAllModules(true)
          .filter(m => m.isEnabled())
          .map(m => `BA__module_${m.id}`)
      )
    }
  })
}

export default patchRootElementContext
