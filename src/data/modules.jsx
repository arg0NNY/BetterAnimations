import ModuleKey, { ModuleKeyAlias } from '@/enums/ModuleKey'
import Setting from '@/enums/AnimationSetting'
import Axis from '@/enums/Axis'
import Direction from '@/enums/Direction'
import Position from '@/enums/Position'
import ModuleType from '@/enums/ModuleType'
import { heightModifier, marginRightModifier } from '@/helpers/modifiers'
import DirectionAutoType from '@/enums/DirectionAutoType.js'
import Messages from '@/modules/Messages'
import { Anchor } from '@/modules/DiscordModules'

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
    description: () => (
      <>
        Animates the&nbsp;transitions when switching between servers and&nbsp;other full-screen pages.
        Supports auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;order of&nbsp;elements in&nbsp;the&nbsp;server list.
      </>
    ),
    alert: Messages.HEAVY_MODULE_ALERT,
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
    description: () => (
      <>
        Animates the&nbsp;transitions when switching between channels and other pages sharing the&nbsp;same sidebar.
        Supports auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;order of&nbsp;elements in&nbsp;the&nbsp;sidebar.
      </>
    ),
    alert: Messages.HEAVY_MODULE_ALERT,
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
    description: () => (
      <>
        Animates the&nbsp;transitions when switching between sections of&nbsp;the&nbsp;settings.
        Supports auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;order of&nbsp;sections in&nbsp;the&nbsp;navigation sidebar.
      </>
    ),
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
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;interactive floating UI elements application-wide, such as User Profiles, Inbox, etc.
        Supports auto-position and auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;location of&nbsp;the&nbsp;anchor element.
        Context Menus that have a&nbsp;strictly defined anchor element are&nbsp;controlled by&nbsp;this&nbsp;module.
      </>
    ),
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
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;informative floating UI elements application-wide,
        such as various control descriptions, server titles in&nbsp;the&nbsp;server list and other non-interactive elements that provide clarity to&nbsp;Discord's interfaces.
        Supports auto-position and auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;location of&nbsp;the&nbsp;anchor element.
      </>
    ),
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
    description: setSection => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;a&nbsp;context menu that is activated by&nbsp;right-clicking on&nbsp;various UI elements.
        Supports auto-position and auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;location of&nbsp;the&nbsp;anchor element or a&nbsp;pointer.
        Context Menus that have a&nbsp;strictly defined anchor element, with the exception of&nbsp;context submenus, are controlled by&nbsp;<Anchor onClick={() => setSection(ModuleKey.Popouts)}>Popouts</Anchor>.
      </>
    ),
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
    description: () => (
      <>
        Animates the&nbsp;appearance of&nbsp;new messages and the&nbsp;disappearance of&nbsp;deleted messages and other UI elements in&nbsp;the&nbsp;chat.
        Supports smooth expand and collapse transitions to&nbsp;prevent abrupt layout shifts during dynamic content updates.
      </>
    ),
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
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;channels in&nbsp;the&nbsp;channel list triggered by&nbsp;switching categories,
        creating or deleting a&nbsp;channel, and other actions that change the contents of&nbsp;the&nbsp;channel list.
        Supports smooth expand and collapse transitions to&nbsp;prevent abrupt layout shifts during dynamic content updates.
      </>
    ),
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
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;full-screen modal windows.
      </>
    ),
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
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;a&nbsp;dimming overlay behind modal windows.
        Backdrop animations can alter the&nbsp;static styles of&nbsp;the&nbsp;backdrop.
      </>
    ),
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
    description: () => (
      <>
        Animates the&nbsp;transitions when switching between full-screen views of&nbsp;the&nbsp;Discord&nbsp;app, such as Settings, Shop, etc.
        Supports auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;user’s navigation history across layered views.
      </>
    ),
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
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;sidebars inside the&nbsp;chat area, such as Member List, Message Search Results, etc.
        Supports smooth expand and collapse transitions to&nbsp;prevent abrupt layout shifts during the&nbsp;switch.
      </>
    ),
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
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;full-screen sidebars, such as Thread Chat, Forum Post Chat, etc.
        Supports smooth expand and collapse transitions to&nbsp;prevent abrupt layout shifts during the&nbsp;switch.
      </>
    ),
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
    description: () => (
      <>
        Animates the&nbsp;transitions when switching between full-screen sidebars, such as between threads or forum posts.
      </>
    ),
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
