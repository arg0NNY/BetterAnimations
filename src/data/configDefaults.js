import ModuleKey from '@/enums/ModuleKey'

export const configDefaults = {
  modules: {
    [ModuleKey.Servers]: {
      enabled: true,
      enhanceLayout: true,
      enter: {
        packSlug: 'test',
        animationKey: 'example'
      },
      exit: {
        packSlug: 'test',
        animationKey: 'example'
      }
    }
  },
  general: {
    switchCooldownDuration: 1000
  }
}
