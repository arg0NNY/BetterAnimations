import useUpdate from '@/hooks/useUpdate'
import PackRegistry from '@/modules/PackRegistry'
import Emitter from '@/modules/Emitter'
import Events from '@shared/enums/Events'
import { useEffect } from 'react'

export function usePackRegistry () {
  const update = useUpdate()

  useEffect(() => {
    Emitter.on(Events.PackRegistryUpdated, update)
    return () => Emitter.off(Events.PackRegistryUpdated, update)
  })

  return PackRegistry
}

export default usePackRegistry
