import useForceUpdate from '@/hooks/useForceUpdate'
import Emitter from '@/modules/Emitter'
import { useCallback, useEffect } from 'react'

function useEmitterEffect (events) {
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    const _events = [].concat(events)
    _events.forEach(e => Emitter.on(e, forceUpdate))
    return () => _events.forEach(e => Emitter.off(e, forceUpdate))
  }, [events])

  return useCallback(Emitter.emit.bind(Emitter), [])
}

export default useEmitterEffect
