import { React } from '@/BdApi'
import useForceUpdate from '@/hooks/useForceUpdate'
import Emitter from '@/modules/Emitter'
import Events from '@/enums/Events'
import Modules from '@/modules/Modules'

function useModule (id) {
  const forceUpdate = useForceUpdate()

  React.useEffect(() => {
    const events = [Events.PackLoaded, Events.PackUnloaded, Events.SettingsChanged]
    const ifSameId = moduleId => moduleId === id && forceUpdate()

    events.forEach(e => Emitter.on(e, forceUpdate))
    Emitter.on(Events.ModuleSettingsChanged, ifSameId)
    return () => {
      events.forEach(e => Emitter.off(e, forceUpdate))
      Emitter.off(Events.ModuleSettingsChanged, ifSameId)
    }
  }, [id])

  return Modules.getModule(id)
}

export default useModule
