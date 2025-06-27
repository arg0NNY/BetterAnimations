import ModuleKey from '@enums/ModuleKey'
import { internalPackSlugs, PREINSTALLED_PACK_SLUG } from '@packs'
import { omit } from '@utils/object'

export const CONFIG_VERSION = 2

export const packConfigDefaults = {
  configVersion: CONFIG_VERSION,
  entries: []
}

export const configDefaults = {
  modules: {
    [ModuleKey.Servers]: {
      enabled: false,
      enhanceLayout: true,
      enter: {
        packSlug: null,
        animationKey: null
      },
      exit: {
        packSlug: null,
        animationKey: null
      }
    },
    [ModuleKey.Channels]: {
      enabled: false,
      enter: {
        packSlug: null,
        animationKey: null
      },
      exit: {
        packSlug: null,
        animationKey: null
      }
    },
    [ModuleKey.Settings]: {
      enabled: true,
      enter: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'slip'
      },
      exit: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'slip'
      }
    },
    [ModuleKey.Layers]: {
      enabled: true,
      enter: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'circleScale'
      },
      exit: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'circleScale'
      }
    },
    [ModuleKey.Tooltips]: {
      enabled: true,
      enter: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'scale'
      },
      exit: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'scale'
      }
    },
    [ModuleKey.Popouts]: {
      enabled: true,
      enter: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'slip'
      },
      exit: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'slip'
      }
    },
    [ModuleKey.ContextMenu]: {
      enabled: true,
      enter: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'scale'
      },
      exit: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'scale'
      }
    },
    [ModuleKey.Messages]: {
      enabled: true,
      enter: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'fade'
      },
      exit: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'fade'
      }
    },
    [ModuleKey.ChannelList]: {
      enabled: true,
      enter: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'slip'
      },
      exit: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'slip'
      }
    },
    [ModuleKey.Modals]: {
      enabled: true,
      enter: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'slip'
      },
      exit: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'slip'
      }
    },
    [ModuleKey.ModalsBackdrop]: {
      enabled: true,
      enter: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'backdropBlur'
      },
      exit: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'backdropBlur'
      }
    },
    [ModuleKey.MembersSidebar]: {
      enabled: true,
      enter: {
        packSlug: null,
        animationKey: null
      },
      exit: {
        packSlug: null,
        animationKey: null
      }
    },
    [ModuleKey.ThreadSidebar]: {
      enabled: true,
      enter: {
        packSlug: null,
        animationKey: null
      },
      exit: {
        packSlug: null,
        animationKey: null
      }
    },
    [ModuleKey.ThreadSidebarSwitch]: {
      enabled: false,
      enter: {
        packSlug: null,
        animationKey: null
      },
      exit: {
        packSlug: null,
        animationKey: null
      }
    }
  },
  packs: Object.fromEntries(
    internalPackSlugs.map(slug => [slug, omit(packConfigDefaults, ['configVersion'])])
  ),
  general: {
    switchCooldownDuration: 1000,
    prioritizeAnimationSmoothness: true,
    cacheUserSettingsSections: true
  }
}
