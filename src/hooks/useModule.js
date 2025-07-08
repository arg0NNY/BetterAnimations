import Patcher from '@/modules/Patcher'
import useUpdate from '@/hooks/useUpdate'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'
import Core from '@/modules/Core'
import { useEffect } from 'react'

export function moduleEffectFull (id, callback) {
  const events = [Events.PackLoaded, Events.PackUnloaded, Events.PackEnabled, Events.PackDisabled, Events.SettingsChanged]
  const moduleEvents = [Events.ModuleToggled, Events.ModuleSettingsChanged]
  const ifSameId = moduleId => moduleId === id && callback()

  events.forEach(e => Emitter.on(e, callback))
  moduleEvents.forEach(e => Emitter.on(e, ifSameId))
  return () => {
    events.forEach(e => Emitter.off(e, callback))
    moduleEvents.forEach(e => Emitter.off(e, ifSameId))
  }
}

export function moduleEffectToggleOnly (id, callback) {
  const ifSameId = moduleId => moduleId === id && callback()

  Emitter.on(Events.ModuleToggled, ifSameId)
  return () => Emitter.off(Events.ModuleToggled, ifSameId)
}

export function moduleEffect (id, callback, full = false) {
  if (full) return moduleEffectFull(id, callback)
  return moduleEffectToggleOnly(id, callback)
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

  return Core.getModule(id)
}

export default useModule
