import ModuleKey from '@/enums/ModuleKey'
import AnimationSetting from '@/enums/AnimationSetting'
import Axis from '@/enums/Axis'
import Direction from '@/enums/Direction'
import Position from '@/enums/Position'

const modules = [
  {
    id: ModuleKey.Servers,
    name: 'Servers'
  },
  {
    id: ModuleKey.Channels,
    name: 'Channels'
  },
  {
    id: ModuleKey.Settings,
    name: 'Settings',
    meta: {
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
    name: 'Layers'
  }
]

export default modules
