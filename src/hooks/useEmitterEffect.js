import { React } from '@/BdApi'
import useForceUpdate from '@/hooks/useForceUpdate'
import Emitter from '@/modules/Emitter'

function useEmitterEffect (events) {
  const forceUpdate = useForceUpdate()

  React.useEffect(() => {
    const _events = [].concat(events)
    _events.forEach(e => Emitter.on(e, forceUpdate))
    return () => _events.forEach(e => Emitter.off(e, forceUpdate))
  }, [events])

  return React.useCallback(Emitter.emit.bind(Emitter), [])
}

export default useEmitterEffect
