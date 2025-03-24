import { Patcher } from '@/BdApi'
import useUpdate from '@/hooks/useUpdate'
import Emitter from '@/modules/Emitter'
import Events from '@/enums/Events'
import Modules from '@/modules/Modules'
import { useEffect } from 'react'

export function moduleEffectFull (id, forceUpdate) {
  const events = [Events.PackLoaded, Events.PackUnloaded, Events.PackEnabled, Events.PackDisabled, Events.SettingsChanged]
  const moduleEvents = [Events.ModuleToggled, Events.ModuleSettingsChanged]
  const ifSameId = moduleId => moduleId === id && forceUpdate()

  events.forEach(e => Emitter.on(e, forceUpdate))
  moduleEvents.forEach(e => Emitter.on(e, ifSameId))
  return () => {
    events.forEach(e => Emitter.off(e, forceUpdate))
    moduleEvents.forEach(e => Emitter.off(e, ifSameId))
  }
}

export function moduleEffectToggleOnly (id, forceUpdate) {
  const ifSameId = moduleId => moduleId === id && forceUpdate()

  Emitter.on(Events.ModuleToggled, ifSameId)
  return () => Emitter.off(Events.ModuleToggled, ifSameId)
}

export function moduleEffect (id, forceUpdate, full = false) {
  if (full) return moduleEffectFull(id, forceUpdate)
  return moduleEffectToggleOnly(id, forceUpdate)
}

// For class components
export function injectModule (component, id, full = false) {
  Patcher.after(component.prototype, 'componentDidMount', (self) => {
    const effects = [].concat(id).map(id => moduleEffect(id, () => self.forceUpdate(), full))
    self.__clearModuleEffect = () => effects.forEach(e => e())
  })
  Patcher.after(component.prototype, 'componentWillUnmount', (self) => {
    self.__clearModuleEffect?.()
  })
}

function useModule (id, full = false) {
  const update = useUpdate()

  useEffect(() => moduleEffect(id, update, full), [id])

  return Modules.getModule(id)
}

export default useModule
