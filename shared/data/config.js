import ModuleKey from '@enums/ModuleKey'
import { PREINSTALLED_PACK_SLUG } from '@packs'
import SuppressErrors from '@enums/SuppressErrors'

export const CONFIG_VERSION = 2

export const packConfigDefaults = {
  entries: []
}

export const configDefaults = {
  modules: {
    [ModuleKey.Servers]: {
      enabled: true,
      enhanceLayout: true,
      enter: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'slide'
      },
      exit: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'slide'
      }
    },
    [ModuleKey.Channels]: {
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
        animationKey: 'scale'
      },
      exit: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'scale'
      }
    },
    [ModuleKey.Tooltips]: {
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
        animationKey: 'slip'
      },
      exit: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'slip'
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
        animationKey: 'backdropSolid'
      },
      exit: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'backdropSolid'
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
      enabled: true,
      enter: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'fade'
      },
      exit: {
        packSlug: PREINSTALLED_PACK_SLUG,
        animationKey: 'fade'
      }
    }
  },
  general: {
    quickPreview: true,
    disableHints: false,
    suppressErrors: SuppressErrors.None,
    prioritizeAnimationSmoothness: true,
    cacheUserSettingsSections: true,
    preloadLayers: true,
    switchCooldownDuration: 1000
  }
}
