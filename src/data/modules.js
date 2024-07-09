import ModuleKey, { ModuleKeyAlias } from '@/enums/ModuleKey'
import Setting from '@/enums/AnimationSetting'
import Axis from '@/enums/Axis'
import Direction from '@/enums/Direction'
import Position from '@/enums/Position'
import ModuleType from '@/enums/ModuleType'
import { heightModifier, marginRightModifier } from '@/helpers/modifiers'
import DirectionAutoType from '@/enums/DirectionAutoType.js'

export const moduleAliases = {
  [ModuleKeyAlias.Switch]: [
    ModuleKey.Servers,
    ModuleKey.Channels,
    ModuleKey.Settings,
    ModuleKey.Layers,
    ModuleKey.ThreadSidebarSwitch
  ],
  [ModuleKeyAlias.Reveal]: [
    ModuleKey.Popouts,
    ModuleKey.Tooltips,
    ModuleKey.ContextMenu,
    ModuleKey.Messages,
    ModuleKey.ChannelList,
    ModuleKey.Modals
  ],
  [ModuleKeyAlias.Sidebars]: [
    ModuleKey.MembersSidebar,
    ModuleKey.ThreadSidebar
  ]
}

const modules = [
  {
    id: ModuleKey.Servers,
    name: 'Servers',
    meta: {
      type: ModuleType.Switch,
      settings: {
        supportsAuto: {
          [Setting.Direction]: DirectionAutoType.Alternate
        },
        defaults: {
          [Setting.DirectionAxis]: Axis.Y,
          [Setting.Overflow]: false
        }
      }
    }
  },
  {
    id: ModuleKey.Channels,
    name: 'Channels',
    meta: {
      type: ModuleType.Switch,
      settings: {
        supportsAuto: {
          [Setting.Direction]: DirectionAutoType.Alternate
        },
        defaults: {
          [Setting.DirectionAxis]: Axis.Y,
          [Setting.Overflow]: false
        }
      }
    }
  },
  {
    id: ModuleKey.Settings,
    name: 'Settings',
    meta: {
      type: ModuleType.Switch,
      settings: {
        supportsAuto: {
          [Setting.Direction]: DirectionAutoType.Alternate
        },
        defaults: {
          [Setting.DirectionAxis]: Axis.Y,
          [Setting.Overflow]: false
        }
      }
    }
  },
  {
    id: ModuleKey.Popouts,
    name: 'Popouts',
    meta: {
      settings: {
        supportsAuto: {
          [Setting.Position]: true,
          [Setting.Direction]: DirectionAutoType.Anchor
        },
        defaults: {
          [Setting.DirectionTowards]: false
        }
      }
    }
  },
  {
    id: ModuleKey.Tooltips,
    name: 'Tooltips',
    meta: {
      settings: {
        supportsAuto: {
          [Setting.Position]: true,
          [Setting.Direction]: DirectionAutoType.Anchor
        },
        defaults: {
          [Setting.DirectionTowards]: false
        }
      }
    }
  },
  {
    id: ModuleKey.ContextMenu,
    name: 'Context Menu',
    meta: {
      settings: {
        supportsAuto: {
          [Setting.Position]: true,
          [Setting.Direction]: DirectionAutoType.Anchor
        },
        defaults: {
          [Setting.DirectionTowards]: false
        }
      }
    }
  },
  {
    id: ModuleKey.Messages,
    name: 'Messages',
    meta: {
      modifier: {
        create: heightModifier,
        defaults: {
          [Setting.Duration]: 200,
          [Setting.Easing]: 'easeInOutQuad'
        }
      },
      settings: {
        defaults: {
          [Setting.Direction]: Direction.Upwards,
          [Setting.Position]: Position.Left
        }
      }
    }
  },
  {
    id: ModuleKey.ChannelList,
    name: 'Channel List',
    meta: {
      modifier: {
        create: heightModifier,
        defaults: {
          [Setting.Duration]: 200,
          [Setting.Easing]: 'easeInOutQuad'
        }
      },
      settings: {
        defaults: {
          [Setting.Position]: Position.Left
        }
      }
    }
  },
  {
    id: ModuleKey.Modals,
    name: 'Modals',
    meta: {
      settings: {
        defaults: {
          [Setting.Position]: Position.Center
        }
      }
    }
  },
  {
    id: ModuleKey.ModalsBackdrop,
    name: 'Backdrop',
    parent: ModuleKey.Modals,
    meta: {
      settings: {
        hideOverflow: true
      }
    }
  },
  {
    id: ModuleKey.Layers,
    name: 'Layers',
    meta: {
      type: ModuleType.Switch,
      settings: {
        supportsAuto: {
          [Setting.Direction]: DirectionAutoType.Alternate
        },
        defaults: {
          [Setting.DirectionAxis]: Axis.Z,
          [Setting.Overflow]: false
        },
        hideOverflow: true
      }
    }
  },
  {
    id: ModuleKey.MembersSidebar,
    name: 'Members Sidebar',
    meta: {
      modifier: {
        create: marginRightModifier,
        defaults: {
          [Setting.Duration]: 400,
          [Setting.Easing]: 'easeInOutQuint'
        }
      }
    }
  },
  {
    id: ModuleKey.ThreadSidebar,
    name: 'Thread Sidebar',
    meta: {
      modifier: {
        create: marginRightModifier,
        defaults: {
          [Setting.Duration]: 400,
          [Setting.Easing]: 'easeInOutQuint'
        }
      }
    }
  },
  {
    id: ModuleKey.ThreadSidebarSwitch,
    name: 'Switch',
    parent: ModuleKey.ThreadSidebar,
    meta: {
      type: ModuleType.Switch,
      settings: {
        defaults: {
          [Setting.Overflow]: false
        }
      }
    }
  }
]

export default modules
