import ModuleKey, { ModuleKeyAlias } from '@/enums/ModuleKey'
import Setting from '@/enums/AnimationSetting'
import Axis from '@/enums/Axis'
import Direction from '@/enums/Direction'
import Position from '@/enums/Position'
import ModuleType from '@/enums/ModuleType'
import { AccordionType, buildAccordionGenerator } from '@/utils/accordion'
import DirectionAutoType from '@/enums/DirectionAutoType'
import Messages from '@/modules/Messages'
import { Anchor } from '@/modules/DiscordModules'
import { EasingBezier, EasingStyle, EasingType } from '@/enums/Easing'
import meta from '@/meta'
import ServerModuleControls from '@/components/ServerModuleControls'
import { forceAppUpdate } from '@/utils/forceUpdate'
import PositionAutoType from '@/enums/PositionAutoType'

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
        Animates the&nbsp;transitions when switching between servers and&nbsp;other full-screen pages, such as DMs and Discover.
        Supports auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;order of&nbsp;elements in&nbsp;the&nbsp;server list.
      </>
    ),
    controls: ServerModuleControls,
    alert: Messages.HEAVY_MODULE_ALERT,
    onToggle: forceAppUpdate,
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
    description: () => (
      <>
        Animates the&nbsp;transitions when switching between full-screen views of&nbsp;the&nbsp;Discord&nbsp;app, such as User&nbsp;Settings, Server&nbsp;Settings, {meta.name} Settings, etc.
        Supports auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;user’s navigation history across layered views.
      </>
    ),
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
        }
      }
    }
  },
  {
    id: ModuleKey.Popouts,
    name: 'Popouts',
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;interactive floating UI elements application-wide, such as User Profiles, Select Inputs, Pinned Messages, etc.
        Supports auto-position and auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;location of&nbsp;the&nbsp;anchor element.
        Context Menus that have a&nbsp;strictly defined anchor element are&nbsp;controlled by&nbsp;this&nbsp;module.
      </>
    ),
    meta: {
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
    description: setSection => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;a&nbsp;context menu that is activated by&nbsp;right-clicking on&nbsp;various UI elements.
        Supports auto-position and auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;location of&nbsp;the&nbsp;pointer.
        Context Menus that have a&nbsp;strictly defined anchor element, with the exception of&nbsp;context submenus, are controlled by&nbsp;<Anchor onClick={() => setSection(ModuleKey.Popouts)}>Popouts</Anchor>.
      </>
    ),
    meta: {
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
    description: () => (
      <>
        Animates the&nbsp;appearance of&nbsp;new messages and the&nbsp;disappearance of&nbsp;deleted messages and other UI elements in&nbsp;the&nbsp;chat.
        Supports smooth expand and collapse transitions to&nbsp;prevent abrupt layout shifts during dynamic content updates.
      </>
    ),
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
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;channels in&nbsp;the&nbsp;channel list triggered by&nbsp;switching categories,
        creating or deleting a&nbsp;channel, and other actions that change the contents of&nbsp;the&nbsp;channel list.
        Supports smooth expand and collapse transitions to&nbsp;prevent abrupt layout shifts during dynamic content updates.
      </>
    ),
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
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;full-screen modal windows.
      </>
    ),
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
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;a&nbsp;dimming overlay behind modal windows.
        Backdrop animations can alter the&nbsp;static styles of&nbsp;the&nbsp;backdrop.
      </>
    ),
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
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;sidebars inside the&nbsp;chat area, such as Member List, Message Search Results, etc.
        Supports smooth expand and collapse transitions to&nbsp;prevent abrupt layout shifts during the&nbsp;switch.
      </>
    ),
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
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;full-screen sidebars, such as Thread Chat, Forum Post Chat, etc.
        Supports smooth expand and collapse transitions to&nbsp;prevent abrupt layout shifts during the&nbsp;switch.
      </>
    ),
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
    description: () => (
      <>
        Animates the&nbsp;transitions when switching between full-screen sidebars, such as between threads or forum posts.
      </>
    ),
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
