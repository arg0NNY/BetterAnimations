import Patcher from '@/modules/Patcher'
import { useRootElementContextKeyed } from '@discord/modules'
import Core from '@/modules/Core'
import clsx from 'clsx'
import ModuleKey from '@enums/ModuleKey'

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
      className: clsx(
        value.className,
        Core.getAllModules(true)
          .filter(m => {
            switch (m.id) {
              case ModuleKey.ThreadSidebar:
                return m.isEnabled() || Core.getModule(ModuleKey.ThreadSidebarSwitch).isEnabled()
              default: return m.isEnabled()
            }
          })
          .map(m => `BA__module_${m.id}`)
      )
    }
  })
}

export default patchRootElementContext
