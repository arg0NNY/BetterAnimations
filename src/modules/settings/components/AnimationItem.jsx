import { React } from '@/BdApi'
import { Common } from '@/modules/DiscordModules'
import ModuleContext from '@/modules/settings/context/ModuleContext'
import AnimationSettings from '@/modules/settings/components/AnimationSettings'

export default function AnimationItem ({
  animation,
  enterActive,
  exitActive,
  setEnter,
  setExit,
  enterSettings,
  exitSettings,
  setEnterSettings,
  setExitSettings
}) {
  const module = React.useContext(ModuleContext)
  const resetSettings = setSettings => () => setSettings(module?.buildDefaultSettings(animation) ?? animation.settings.defaults)

  return (
    <div>
      <Common.FormTitle tag="h5">{animation.name} ({animation.key})</Common.FormTitle>
      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Common.Switch checked={enterActive} onChange={setEnter}>Enter</Common.Switch>
          <Common.Switch checked={exitActive} onChange={setExit}>Exit</Common.Switch>
        </div>
        {enterActive && (
          <Common.Card>
            <Common.FormText>Enter <Common.Button size={Common.ButtonSizes.SMALL} onClick={resetSettings(setEnterSettings)}>Reset</Common.Button></Common.FormText>
            <AnimationSettings animation={animation} settings={enterSettings} onChange={setEnterSettings} />
          </Common.Card>
        )}
        {exitActive && (
          <Common.Card>
            <Common.FormText>Exit <Common.Button size={Common.ButtonSizes.SMALL} onClick={resetSettings(setExitSettings)}>Reset</Common.Button></Common.FormText>
            <AnimationSettings animation={animation} settings={exitSettings} onChange={setExitSettings} />
          </Common.Card>
        )}
      </div>
    </div>
  )
}
