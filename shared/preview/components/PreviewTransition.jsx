import { use } from 'react'
import AnimeTransition from '@components/AnimeTransition'
import PreviewContext from '@preview/context/PreviewContext'
import useMouse from '@preview/hooks/useMouse'

function PreviewTransition ({ module, mouse = useMouse(), ...props }) {
  const { store, id, data, viewportRef } = use(PreviewContext)

  return (
    <AnimeTransition
      store={store}
      module={module}
      data={module.id === id ? data : undefined}
      mouse={mouse}
      viewportRef={viewportRef}
      {...props}
    />
  )
}

export default PreviewTransition
