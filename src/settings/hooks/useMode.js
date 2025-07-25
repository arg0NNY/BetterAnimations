import SettingsMode from '@enums/SettingsMode'
import { useData } from '@/modules/Data'

const useMode = () => useData('settingsMode')

export function useAdvancedMode (force = false) {
  const [mode] = useMode()
  return force || mode === SettingsMode.Advanced
}

export default useMode
