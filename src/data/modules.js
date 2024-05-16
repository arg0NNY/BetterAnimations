import ModuleKey, { ModuleKeyAlias } from '@/enums/ModuleKey'
import AnimationSetting from '@/enums/AnimationSetting'
import Axis from '@/enums/Axis'
import Direction from '@/enums/Direction'
import Position from '@/enums/Position'
import ModuleType from '@/enums/ModuleType'

export const moduleAliases = {
  [ModuleKeyAlias.Switch]: [
    ModuleKey.Servers,
    ModuleKey.Channels,
    ModuleKey.Settings,
    ModuleKey.Layers
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
          [AnimationSetting.Direction]: true
        },
        defaults: {
          [AnimationSetting.DirectionAxis]: Axis.Y
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
          [AnimationSetting.Direction]: true
        },
        defaults: {
          [AnimationSetting.DirectionAxis]: Axis.Y
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
          [AnimationSetting.Direction]: true
        },
        defaults: {
          [AnimationSetting.DirectionAxis]: Axis.Y
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
          [AnimationSetting.Position]: true
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
          [AnimationSetting.Position]: true
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
          [AnimationSetting.Position]: true
        }
      }
    }
  },
  {
    id: ModuleKey.Messages,
    name: 'Messages',
    meta: {
      settings: {
        defaults: {
          [AnimationSetting.Direction]: Direction.Upwards,
          [AnimationSetting.Position]: Position.Left
        }
      }
    }
  },
  {
    id: ModuleKey.ChannelList,
    name: 'Channel List',
    meta: {
      settings: {
        defaults: {
          [AnimationSetting.Position]: Position.Left
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
          [AnimationSetting.Position]: Position.Center
        }
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
          [AnimationSetting.Direction]: true
        },
        defaults: {
          [AnimationSetting.DirectionAxis]: Axis.Z
        }
      }
    }
  },
  {
    id: ModuleKey.MembersSidebar,
    name: 'Members Sidebar'
  },
  {
    id: ModuleKey.ThreadSidebar,
    name: 'Thread Sidebar'
  }
]

export default modules
