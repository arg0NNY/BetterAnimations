import useUpdate from '@shared/hooks/useUpdate'
import Emitter from '@/modules/Emitter'
import { useCallback, useEffect } from 'react'

function useEmitterEffect (events) {
  const update = useUpdate()

  useEffect(() => {
    const _events = [].concat(events)
    _events.forEach(e => Emitter.on(e, update))
    return () => _events.forEach(e => Emitter.off(e, update))
  }, [events])

  return useCallback(Emitter.emit.bind(Emitter), [])
}

export default useEmitterEffect
