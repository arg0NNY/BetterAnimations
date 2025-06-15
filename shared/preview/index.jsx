import { css } from '@style'
import Main from '@preview/views/Main'
import PreviewContext from '@preview/context/PreviewContext'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { AnimationStore } from '@animation/store'
import classNames from 'classnames'
import { CSSTransition, TransitionGroup } from '@discord/modules'
import Settings from '@preview/views/Settings'
import Layers from '@preview/components/Layers'
import ModuleKey from '@enums/ModuleKey'
import Tooltips from '@preview/components/floating/Tooltips'
import Popouts from '@preview/components/floating/Popouts'
import ContextMenus from '@preview/components/floating/ContextMenus'
import { FloatingLayerContainer } from '@preview/components/Floating'
import Modals from '@preview/components/floating/Modals'
import mainPlaceholder from '@preview/assets/placeholders/main.png'
import settingsPlaceholder from '@preview/assets/placeholders/settings.png'
import threadSidebarSwitchPlaceholder from '@preview/assets/placeholders/threadSidebarSwitch.png'

export const PREVIEW_WIDTH = 1280
export const PREVIEW_HEIGHT = 720

function Preview ({
  id = null,
  modules = [],
  active = true,
  placeholder = false,
  pack = null,
  animation = null,
  dataKey = 0,
  className,
  style,
  ref,
  viewportRef = useRef(),
  preferences = {
    memberListShown: true
  }
}) {
  const store = useMemo(() => new AnimationStore, [])

  useEffect(() => {
    store.initialize()
    return () => store.shutdown()
  }, [store])

  const module = useMemo(() => modules.find(m => m.id === id), [id, modules])
  const [data, setData] = useState(null)
  useEffect(() => {
    if (placeholder || !module || !pack || !animation) {
      setData(null)
      return
    }
    setData(module.initializeAnimations(pack, animation))
  }, [placeholder, module, pack, animation, dataKey])

  const placeholderRef = useRef()
  const placeholderSrc = useMemo(() => {
    if (typeof placeholder === 'string') return placeholder

    switch (module?.id) {
      case ModuleKey.Settings: return settingsPlaceholder
      case ModuleKey.ThreadSidebarSwitch: return threadSidebarSwitchPlaceholder
      default: return mainPlaceholder
    }
  }, [placeholder, module])

  const layer = useMemo(() => {
    switch (module.id) {
      case ModuleKey.Settings: return <Settings />
      default: return <Main />
    }
  }, [module])

  const serverListIconRefs = useRef([])
  const userPanelActionRefs = useRef([])
  const channelHeaderItemRefs = useRef([])
  const memberListItemRefs = useRef([])

  const [serverList, setServerList] = useState({})
  const [userPanel, setUserPanel] = useState({})
  const [memberList, setMemberList] = useState({})
  const [threadPopoutShown, setThreadPopoutShown] = useState(false)

  const [memberListShown, _setMemberListShown] = useState(
    id === ModuleKey.ThreadSidebar
      ? preferences.memberListShown
      : id !== ModuleKey.ThreadSidebarSwitch
  )
  const setMemberListShown = (value, force = false) => {
    if (value === preferences.memberListShown || force) _setMemberListShown(value)
  }

  const context = {
    store,
    id,
    modules,
    active,
    pack,
    animation,
    data,
    viewportRef,
    serverListIconRefs,
    userPanelActionRefs,
    channelHeaderItemRefs,
    memberListItemRefs,
    serverList,
    setServerList,
    userPanel,
    setUserPanel,
    memberListShown,
    setMemberListShown,
    memberList,
    setMemberList,
    threadPopoutShown,
    setThreadPopoutShown
  }

  return (
    <PreviewContext value={context}>
      <div
        ref={ref}
        className={classNames(
          'BAP__container',
          `BAP--${id}`,
          className
        )}
        style={style}
      >
        <TransitionGroup component={null}>
          <CSSTransition
            key={placeholder ? 'placeholder' : 'viewport'}
            nodeRef={placeholder ? placeholderRef : viewportRef}
            classNames={placeholder ? 'BAP__fade' : undefined}
            timeout={400}
          >
            {placeholder ? (
              <img
                ref={placeholderRef}
                src={placeholderSrc}
                className="BAP__viewport"
              />
            ) : (
              <div
                ref={viewportRef}
                className="BAP__viewport"
              >
                <Layers layer={layer} />
                <FloatingLayerContainer>
                  <Modals />
                  <Tooltips />
                  <Popouts />
                  <ContextMenus />
                </FloatingLayerContainer>
              </div>
            )}
          </CSSTransition>
        </TransitionGroup>
      </div>
    </PreviewContext>
  )
}

export default memo(Preview)

css
`.BAP__container {
    position: relative;
    overflow: clip;
    width: ${PREVIEW_WIDTH}px;
    height: ${PREVIEW_HEIGHT}px;
    contain: strict;
}
.BAP__viewport {
    --bap-background-primary: #202024;
    --bap-background-secondary: #1A1A1E;
    --bap-background-secondary-alt: #18181C;
    --bap-background-tertiary: #121214;
    --bap-background-surface-overlay: #242429;
    --bap-border-subtle: rgba(151, 151, 159, .12);
    --bap-text-primary: #3B3D42;
    --bap-text-heading: #505357;
    --bap-brand-primary: #5865F2;
    --bap-white: #FBFBFB;
    --bap-current: currentColor;

    position: absolute;
    inset: 0;
    isolation: isolate;
    font-size: 16px;
    color: var(--bap-text-primary);
    background-color: var(--bap-background-tertiary);
    overflow: clip;
    object-fit: cover;
}
img.BAP__viewport {
    z-index: 2;
}
.BAP__viewport > * {
    position: absolute;
    inset: 0;
}
.BAP__viewport * {
    border-color: var(--bap-border-subtle);
    border-style: solid;
    border-width: 0;
    box-sizing: content-box;
}

.BAP--messages .BAP__viewport {
    transform-origin: 63% bottom;
    scale: 1.35;
}
.BAP--membersSidebar .BAP__viewport {
    transform-origin: bottom right;
    scale: 1.05;
}
.BAP--tooltips .BAP__viewport {
    transform-origin: bottom left;
    scale: 2.8;
}
.BAP--channelList .BAP__viewport {
    transform-origin: left 66%;
    scale: 1.5;
}
.BAP--popouts .BAP__viewport {
    transform-origin: top right;
    scale: 1.3;
}
.BAP--contextMenu .BAP__viewport {
    transform-origin: 0 58%;
    scale: 1.45;
}

.BAP__fade-enter-active, .BAP__fade-exit-active {
    transition: opacity .4s;
}
.BAP__fade-enter, .BAP__fade-exit-active {
    opacity: 0;
}
.BAP__fade-enter-active {
    opacity: 1;
}`
`Preview`
