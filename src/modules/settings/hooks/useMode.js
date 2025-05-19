import SettingsMode from '@shared/enums/SettingsMode'
import useEmitterEffect from '@/hooks/useEmitterEffect'
import Events from '@shared/enums/Events'
import Data from '@/modules/Data'
import { useCallback } from 'react'

const DATA_KEY = 'settingsMode'

function useMode () {
  const emit = useEmitterEffect(Events.SettingsModeChanged)

  return [
    Data[DATA_KEY] || SettingsMode.Simple,
    useCallback(value => {
      Data[DATA_KEY] = value
      emit(Events.SettingsModeChanged, value)
    }, [])
  ]
}

export function useAdvancedMode (force = false) {
  const [mode] = useMode()
  return force || mode === SettingsMode.Advanced
}

export default useMode
