import Enum from '@shared/enum'

export const ModuleKeyAlias = Enum({
  Switch: 'switch',
  Reveal: 'reveal',
  Sidebars: 'sidebars'
})

export default Enum({
  Servers: 'servers',
  Channels: 'channels',
  Settings: 'settings',
  Popouts: 'popouts',
  Tooltips: 'tooltips',
  ContextMenu: 'contextMenu',
  Messages: 'messages',
  ChannelList: 'channelList',
  Modals: 'modals',
  ModalsBackdrop: 'modalsBackdrop',
  Layers: 'layers',
  MembersSidebar: 'membersSidebar',
  ThreadSidebar: 'threadSidebar',
  ThreadSidebarSwitch: 'threadSidebarSwitch'
})
