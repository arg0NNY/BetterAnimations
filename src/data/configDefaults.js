import ModuleKey from '@/enums/ModuleKey'

// TODO: Finalize default settings
export const configDefaults = {
  modules: {
    [ModuleKey.Servers]: {
      enabled: true,
      enter: {
        packSlug: 'test',
        animationKey: 'example'
      },
      exit: {
        packSlug: 'test',
        animationKey: 'example'
      }
    },
    [ModuleKey.Modals]: {
      settings: {
        backdropTransitionDuration: 200
      }
    },
    [ModuleKey.Sidebars]: {
      settings: {
        duration: 400,
        easing: 'easeInOutQuint'
      }
    }
  }
}
