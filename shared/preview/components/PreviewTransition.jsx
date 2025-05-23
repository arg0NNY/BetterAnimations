import { use } from 'react'
import AnimeTransition from '@components/AnimeTransition'
import PreviewContext from '@preview/context/PreviewContext'
import useMouse from '@preview/hooks/useMouse'

function PreviewTransition ({ mouse = useMouse(), ...props }) {
  const { store, data, viewportRef } = use(PreviewContext)

  return (
    <AnimeTransition
      store={store}
      data={data}
      mouse={mouse}
      viewportRef={viewportRef}
      {...props}
    />
  )
}

export default PreviewTransition
