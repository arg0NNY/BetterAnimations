import { React } from '@/BdApi'
import { Common } from '@/modules/DiscordModules'
import ModuleContext from '@/modules/settings/context/ModuleContext'
import AnimationSettings from '@/modules/settings/components/AnimationSettings'
import AnimationType from '@/enums/AnimationType'
import { getAnimationDefaultSettings } from '@/helpers/animations'

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
  const resetSettings = (setSettings, type) => () => setSettings(
    module?.buildDefaultSettings(animation, type) ?? getAnimationDefaultSettings(animation, type)
  )

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
            <Common.FormText>Enter <Common.Button size={Common.ButtonSizes.SMALL} onClick={resetSettings(setEnterSettings, AnimationType.Enter)}>Reset</Common.Button></Common.FormText>
            <AnimationSettings animation={animation} type={AnimationType.Enter} settings={enterSettings} onChange={setEnterSettings} />
          </Common.Card>
        )}
        {exitActive && (
          <Common.Card>
            <Common.FormText>Exit <Common.Button size={Common.ButtonSizes.SMALL} onClick={resetSettings(setExitSettings, AnimationType.Exit)}>Reset</Common.Button></Common.FormText>
            <AnimationSettings animation={animation} type={AnimationType.Exit} settings={exitSettings} onChange={setExitSettings} />
          </Common.Card>
        )}
      </div>
    </div>
  )
}
