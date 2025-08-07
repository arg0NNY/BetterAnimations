import { use, useState } from 'react'
import AnimeTransition from '@components/AnimeTransition'
import PreviewContext from '@preview/context/PreviewContext'
import useMouse from '@preview/hooks/useMouse'
import { getRef } from '@utils/react'
import { getCenter, getRect } from '@utils/position'

function PreviewTransition ({ module, anchor, ...props }) {
  const { store, id, data, viewportRef, onError } = use(PreviewContext)

  const [mouseCoords, setMouseCoords] = useState()
  const mouse = useMouse(mouseCoords)
  const onStart = () => {
    const anchorRef = getRef(anchor)
    if (!anchorRef || !viewportRef.current) return setMouseCoords(undefined)

    const [x, y] = getCenter(getRect(anchorRef, viewportRef.current))
    setMouseCoords({ x, y })
  }

  return (
    <AnimeTransition
      store={store}
      module={module}
      data={module.id === id ? data : undefined}
      mouse={mouse}
      viewportRef={viewportRef}
      anchor={anchor}
      onEntering={onStart}
      onExiting={onStart}
      onError={onError}
      {...props}
    />
  )
}

export default PreviewTransition
