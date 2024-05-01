import ModuleKey from '@/enums/ModuleKey'
import AnimationSetting from '@/enums/AnimationSetting'
import Axis from '@/enums/Axis'

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
    name: 'Tooltips'
  },
  {
    id: ModuleKey.ContextMenu,
    name: 'Context Menu'
  },
  {
    id: ModuleKey.Messages,
    name: 'Messages'
  },
  {
    id: ModuleKey.ChannelList,
    name: 'Channel List'
  },
  {
    id: ModuleKey.Modals,
    name: 'Modals'
  },
  {
    id: ModuleKey.Layers,
    name: 'Layers'
  }
]

export default modules
