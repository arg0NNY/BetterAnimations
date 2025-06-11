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
  serverList: {},
  setServerList: () => {},
  userPanel: {},
  setUserPanel: () => {},
  memberListShown: true,
  setMemberListShown: () => {}
})

export default PreviewContext
