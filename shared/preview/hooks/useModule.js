import { use } from 'react'
import PreviewContext from '@preview/context/PreviewContext'

function useModule (id) {
  const { id: activeId, modules, active } = use(PreviewContext)

  return [modules.find(m => m.id === id), active && id === activeId]
}

export default useModule
