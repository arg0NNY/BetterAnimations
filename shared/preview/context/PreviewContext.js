import { createContext } from 'react'

const PreviewContext = createContext({
  store: null,
  id: null,
  modules: [],
  active: true,
  pack: null,
  animation: null,
  data: null,
  viewportRef: { current: null },
  serverListIconRefs: { current: [] },
  userPanelActionRefs: { current: [] },
  channelHeaderItemRefs: { current: [] },
  memberListItemRefs: { current: [] },
  serverList: {},
  setServerList: () => {},
  userPanel: {},
  setUserPanel: () => {},
  memberListShown: true,
  setMemberListShown: () => {},
  memberList: {},
  setMemberList: () => {},
  threadPopoutShown: false,
  setThreadPopoutShown: () => {}
})

export default PreviewContext
