import Data from '@/modules/Data'
import deepmerge from 'deepmerge'
import Modules from '@/enums/ModuleKey'

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
  }
}

export let settings = load(defaults)

export function load (defaults) {
  return deepmerge(defaults, Data.settings ?? {})
}

export function save (value = settings) {
  Data.settings = value
}

export default {
  settings,
  load,
  save
}
