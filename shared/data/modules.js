import ModuleKey, { ModuleKeyAlias } from '@enums/ModuleKey'
import Setting from '@enums/AnimationSetting'
import Axis from '@enums/Axis'
import ModuleType from '@enums/ModuleType'
import { AccordionType, buildAccordionGenerator } from '@utils/accordion'
import DirectionAutoType from '@enums/DirectionAutoType'
import { EasingBezier, EasingStyle, EasingType } from '@enums/Easing'
import PositionAutoType from '@enums/PositionAutoType'

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
          [Setting.Position]: PositionAutoType.Precise,
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
          [Setting.Position]: PositionAutoType.Precise,
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
          [Setting.Position]: PositionAutoType.Precise,
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
    id: ModuleKey.Layers,
    name: 'Layers',
    meta: {
      type: ModuleType.Switch,
      settings: {
        supportsAuto: {
          [Setting.Position]: [PositionAutoType.Precise, { preservable: true, preserveLabel: 'Preserve for individual layers' }],
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
    id: ModuleKey.Tooltips,
    name: 'Tooltips',
    meta: {
      interceptEvents: false,
      waitUntilSafe: true,
      settings: {
        supportsAuto: {
          [Setting.Position]: true,
          [Setting.Direction]: DirectionAutoType.Anchor
        }
      }
    }
  },
  {
    id: ModuleKey.Popouts,
    name: 'Popouts',
    meta: {
      waitUntilSafe: true,
      settings: {
        supportsAuto: {
          [Setting.Position]: true,
          [Setting.Direction]: DirectionAutoType.Anchor
        }
      }
    }
  },
  {
    id: ModuleKey.ContextMenu,
    name: 'Context Menu',
    meta: {
      waitUntilSafe: true,
      settings: {
        supportsAuto: {
          [Setting.Position]: true,
          [Setting.Direction]: DirectionAutoType.Anchor
        }
      }
    }
  },
  {
    id: ModuleKey.Messages,
    name: 'Messages',
    meta: {
      accordion: {
        create: buildAccordionGenerator(AccordionType.MarginBottom, { hideElement: true }),
        defaults: {
          [Setting.Duration]: 200,
          [Setting.Easing]: {
            type: EasingType.Ease,
            bezier: EasingBezier.InOut,
            style: EasingStyle.Quad
          }
        }
      }
    }
  },
  {
    id: ModuleKey.ChannelList,
    name: 'Channel List',
    meta: {
      accordion: {
        create: buildAccordionGenerator(AccordionType.MarginBottom, { hideElement: true }),
        defaults: {
          [Setting.Duration]: 200,
          [Setting.Easing]: {
            type: EasingType.Ease,
            bezier: EasingBezier.InOut,
            style: EasingStyle.Quad
          }
        }
      }
    }
  },
  {
    id: ModuleKey.Modals,
    name: 'Modals',
    meta: {
      settings: {
        supportsAuto: {
          [Setting.Position]: [PositionAutoType.Precise, { asDefault: false }]
        }
      }
    }
  },
  {
    id: ModuleKey.ModalsBackdrop,
    name: 'Backdrop',
    parent: ModuleKey.Modals,
    meta: {
      revert: false,
      settings: {
        supportsAuto: {
          [Setting.Position]: [PositionAutoType.Precise, { asDefault: false }]
        },
        hideOverflow: true
      }
    }
  },
  {
    id: ModuleKey.MembersSidebar,
    name: 'Members Sidebar',
    meta: {
      settings: {
        supportsAuto: {
          [Setting.Position]: [PositionAutoType.Precise, { asDefault: false }]
        },
      },
      accordion: {
        create: buildAccordionGenerator(AccordionType.MarginRight),
        defaults: {
          [Setting.Duration]: 400,
          [Setting.Easing]: {
            type: EasingType.Ease,
            bezier: EasingBezier.InOut,
            style: EasingStyle.Quint
          }
        }
      }
    }
  },
  {
    id: ModuleKey.ThreadSidebar,
    name: 'Thread Sidebar',
    meta: {
      settings: {
        supportsAuto: {
          [Setting.Position]: [PositionAutoType.Precise, { asDefault: false }]
        },
      },
      accordion: {
        create: buildAccordionGenerator(AccordionType.MarginRight),
        defaults: {
          [Setting.Duration]: 400,
          [Setting.Easing]: {
            type: EasingType.Ease,
            bezier: EasingBezier.InOut,
            style: EasingStyle.Quint
          }
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
        supportsAuto: {
          [Setting.Position]: [PositionAutoType.Precise, { asDefault: false }]
        },
        defaults: {
          [Setting.Overflow]: false
        }
      }
    }
  }
]

export default modules
