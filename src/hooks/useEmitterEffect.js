import useUpdate from '@/hooks/useUpdate'
import Emitter from '@/modules/Emitter'
import { useCallback, useEffect, useRef } from 'react'

function useEmitterEffect (events, callback) {
  const update = useUpdate()

  const callbackRef = useRef(callback)
  useEffect(() => { callbackRef.current = callback }, [callback])

  useEffect(() => {
    const _events = [].concat(events)
    const _callback = (...args) => (callbackRef.current ?? update)(...args)
    _events.forEach(e => Emitter.on(e, _callback))
    return () => _events.forEach(e => Emitter.off(e, _callback))
  }, [events])

  return useCallback(Emitter.emit.bind(Emitter), [])
}

export default useEmitterEffect
