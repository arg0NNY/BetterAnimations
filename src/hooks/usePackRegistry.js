import { React } from '@/BdApi'
import useForceUpdate from '@/hooks/useForceUpdate'
import PackRegistry from '@/modules/PackRegistry'
import Emitter from '@/modules/Emitter'
import Events from '@/enums/Events'

export function usePackRegistry () {
  const forceUpdate = useForceUpdate()

  React.useEffect(() => {
    Emitter.on(Events.PackRegistryUpdated, forceUpdate)
    return () => Emitter.off(Events.PackRegistryUpdated, forceUpdate)
  })

  return PackRegistry
}

export default usePackRegistry
