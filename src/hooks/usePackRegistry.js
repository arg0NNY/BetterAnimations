import useForceUpdate from '@/hooks/useForceUpdate'
import PackRegistry from '@/modules/PackRegistry'
import Emitter from '@/modules/Emitter'
import Events from '@/enums/Events'
import { useEffect } from 'react'

export function usePackRegistry () {
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    Emitter.on(Events.PackRegistryUpdated, forceUpdate)
    return () => Emitter.off(Events.PackRegistryUpdated, forceUpdate)
  })

  return PackRegistry
}

export default usePackRegistry
