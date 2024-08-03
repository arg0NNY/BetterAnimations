import { React } from '@/BdApi'
import SettingsMode from '@/enums/SettingsMode'
import { LocalStorage } from '@/modules/DiscordModules'
import useEmitterEffect from '@/hooks/useEmitterEffect'
import Events from '@/enums/Events'

const LOCAL_STORAGE_KEY = 'BA__settingsMode'

function useMode () {
  const emit = useEmitterEffect(Events.SettingsModeChanged)

  return [
    LocalStorage.get(LOCAL_STORAGE_KEY) || SettingsMode.Simple,
    React.useCallback(value => {
      LocalStorage.set(LOCAL_STORAGE_KEY, value)
      emit(Events.SettingsModeChanged, value)
    }, [])
  ]
}

export function useAdvancedMode (force = false) {
  const [mode] = useMode()
  return force || mode === SettingsMode.Advanced
}

export default useMode
