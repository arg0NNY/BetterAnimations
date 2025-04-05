import { Common } from '@/modules/DiscordModules'
import DurationControl from '@/modules/settingsLegacy/components/controls/DurationControl'
import Config from '@/modules/Config'

function GeneralSettings () {
  return (
    <div>
      <Common.FormTitle tag="h2">General Settings</Common.FormTitle>
      <DurationControl
        label="Switch Cooldown Duration"
        options={{ from: 100, to: 5000 }}
        value={Config.current.general.switchCooldownDuration}
        onChange={v => Config.current.general.switchCooldownDuration = v}
      />
    </div>
  )
}

export default GeneralSettings
