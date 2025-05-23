import { css } from '@style'
import Main from '@preview/views/Main'
import PreviewContext from '@preview/context/PreviewContext'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimationStore } from '@animation/store'

function Preview ({
  id = null,
  modules = [],
  active = true,
  pack = null,
  animation = null,
  dataKey = 0,
  containerRef = useRef(),
  viewportRef = useRef()
}) {
  const store = useMemo(() => new AnimationStore, [])

  useEffect(() => {
    store.initialize()
    return () => store.shutdown()
  }, [store])

  const module = useMemo(() => modules.find(m => m.id === id), [id, modules])
  const [data, setData] = useState(null)
  useEffect(() => {
    if (!module || !pack || !animation) {
      setData(null)
      return
    }
    setData(module.initializeAnimations(pack, animation))
  }, [module, pack, animation, dataKey])

  return (
    <PreviewContext.Provider value={{ store, id, modules, active, pack, animation, data, viewportRef }}>
      <div ref={containerRef} className="BAP__container">
        <div ref={viewportRef} className="BAP__viewport">
          <Main />
        </div>
      </div>
    </PreviewContext.Provider>
  )
}

export default Preview

css
`.BAP__container {
    position: relative;
    overflow: clip;
    width: 1280px;
    height: 720px;
}
.BAP__viewport {
    --background-primary: #202024;
    --background-secondary: #1A1A1E;
    --background-secondary-alt: #18181C;
    --background-tertiary: #121214;
    --background-surface-overlay: #242429;
    --border-subtle: rgba(151, 151, 159, .12);
    --text-primary: #3B3D42;
    --text-heading: #505357;
    --brand-primary: #5865F2;
    --white: #FBFBFB;

    position: absolute;
    inset: 0;
    isolation: isolate;
    font-size: 16px;
    color: var(--text-primary);
    background-color: var(--background-tertiary);
    overflow: clip;
}
.BAP__viewport > * {
    position: absolute;
    inset: 0;
}
.BAP__viewport * {
    border-color: var(--border-subtle);
    border-style: solid;
    border-width: 0;
}`
`Preview`
