import { React } from '@/BdApi'
import { Common, Tooltip } from '@/modules/DiscordModules'
import ModuleContext from '@/modules/settings/context/ModuleContext'
import AnimationSettings from '@/modules/settings/components/AnimationSettings'
import AnimationType from '@/enums/AnimationType'
import { getAnimationDefaultSettings } from '@/helpers/animations'

const FORCED_TEXT = 'Value is forced by selected animation'

function Toggle ({ checked, onChange, disabled = false, text }) {
  const children = (
    <Common.Switch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  )

  return (
    <Tooltip text={text}>
      {props => <div {...props}>{children}</div>}
    </Tooltip>
  )
}

export default function AnimationItem ({
  animation,
  enterActive,
  exitActive,
  enterDisabled = false,
  exitDisabled = false,
  setEnter,
  setExit,
  enterSettings,
  exitSettings,
  setEnterSettings,
  setExitSettings
}) {
  const module = React.useContext(ModuleContext)
  const resetSettings = (setSettings, type) => () => setSettings(
    module?.buildDefaultSettings(animation, type) ?? getAnimationDefaultSettings(animation, type)
  )

  return (
    <div>
      <Common.FormTitle tag="h5">{animation.name}</Common.FormTitle>
      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Toggle checked={enterActive} onChange={setEnter} disabled={enterDisabled} text={enterDisabled ? FORCED_TEXT : 'Enter'} />
          <Toggle checked={exitActive} onChange={setExit} disabled={exitDisabled} text={exitDisabled ? FORCED_TEXT : 'Exit'} />
        </div>
        {enterActive && (
          <Common.Card style={{ padding: '12px' }}>
            <Common.FormText>Enter <Common.Button size={Common.ButtonSizes.SMALL} onClick={resetSettings(setEnterSettings, AnimationType.Enter)}>Reset</Common.Button></Common.FormText>
            {animation.settings && (
              <AnimationSettings animation={animation} type={AnimationType.Enter} settings={enterSettings} onChange={setEnterSettings} />
            )}
          </Common.Card>
        )}
        {exitActive && (
          <Common.Card style={{ padding: '12px' }}>
            <Common.FormText>Exit <Common.Button size={Common.ButtonSizes.SMALL} onClick={resetSettings(setExitSettings, AnimationType.Exit)}>Reset</Common.Button></Common.FormText>
            {animation.settings && (
              <AnimationSettings animation={animation} type={AnimationType.Exit} settings={exitSettings} onChange={setExitSettings} />
            )}
          </Common.Card>
        )}
      </div>
    </div>
  )
}
