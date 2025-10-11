import ButtonGroup from '@/settings/components/ButtonGroup'
import SettingsMode from '@enums/SettingsMode'
import useMode from '@/settings/hooks/useMode'
import { css } from '@style'

function ModeSwitch () {
  const [mode, setMode] = useMode()

  return (
    <div className="BA__modeSwitch">
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

css
`.BA__modeSwitch {
  margin-bottom: 8px;
}`
`ModeSwitch`
