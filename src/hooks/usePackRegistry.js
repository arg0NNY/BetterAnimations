import PackRegistry from '@/modules/PackRegistry'
import Events from '@enums/Events'
import useEmitterEffect from '@/hooks/useEmitterEffect'

export function usePackRegistry () {
  useEmitterEffect([
    Events.PackLoaded,
    Events.PackUnloaded,
    Events.PackRegistryUpdated
  ])

  return PackRegistry
}

export default usePackRegistry
