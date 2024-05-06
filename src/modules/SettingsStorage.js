import Data from '@/modules/Data'
import deepmerge from 'deepmerge'
import Modules from '@/enums/ModuleKey'

// TODO: Finalize default settings
export const defaults = {
  modules: {
    [Modules.Servers]: {
      enabled: true,
      enter: {
        packSlug: 'test',
        animationKey: 'example',
        settings: {}
      },
      exit: {
        packSlug: 'test',
        animationKey: 'example',
        settings: {}
      }
    },
    [Modules.Modals]: {
      settings: {
        backdropTransitionDuration: 200
      }
    },
    [Modules.Sidebars]: {
      settings: {
        duration: 400,
        easing: 'easeInOutQuint'
      }
    }
  }
}

export let settings = {}
load(defaults)

export function load (defaults) {
  settings = deepmerge(defaults, Data.settings ?? {})
}

export function save (value = settings) {
  Data.settings = value
}

export default {
  settings,
  load,
  save
}
