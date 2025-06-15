import { use, useEffect, useMemo } from 'react'
import { Mouse } from '@shared/mouse'
import PreviewContext from '@preview/context/PreviewContext'

function useMouse ({ x, y } = {}) {
  const { viewportRef } = use(PreviewContext)

  x ??= (viewportRef.current?.offsetWidth ?? 0) / 2
  y ??= (viewportRef.current?.offsetHeight ?? 0) / 2

  const mouse = useMemo(() => new Mouse({ x, y }), [])

  useEffect(() => {
    mouse.x = x
    mouse.y = y
  }, [x, y])

  return mouse
}

export default useMouse
