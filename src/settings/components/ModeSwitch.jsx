import ButtonGroup from '@/settings/components/ButtonGroup'
import SettingsMode from '@enums/SettingsMode'
import useMode from '@/settings/hooks/useMode'
import DiscordClasses from '@discord/classes'

function ModeSwitch () {
  const [mode, setMode] = useMode()

  return (
    <div className={`BA__modeSwitch ${DiscordClasses.Margins.marginBottom8}`}>
      <ButtonGroup
        options={[
          { label: 'Simple', value: SettingsMode.Simple },
          { label: 'Advanced', value: SettingsMode.Advanced }
        ]}
        selected={mode}
        onChange={setMode}
      />
    </div>
  )
}

export default ModeSwitch
