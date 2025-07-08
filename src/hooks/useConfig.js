import useEmitterEffect from '@/hooks/useEmitterEffect'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'
import Config from '@/modules/Config'
import { useCallback } from 'react'

function useConfig () {
  useEmitterEffect(Events.SettingsChanged)

  const config = Config.current
  const onChange = useCallback(() => Emitter.emit(Events.SettingsChanged), [])

  return {
    config,
    onChange,
    save: () => Config.save(),
    load: () => Config.load()
  }
}

export default useConfig
