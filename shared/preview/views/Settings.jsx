import { Flex } from '@preview/components'
import NavSidebar from '@preview/components/settings/NavSidebar'
import UserProfileSection from '@preview/components/settings/UserProfileSection'
import SwitchesSection from '@preview/components/settings/SwitchesSection'
import { css } from '@style'
import useModule from '@preview/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import useStages from '@preview/hooks/useStages'
import { TransitionGroup } from '@discord/modules'
import { passAuto } from '@utils/transition'
import PreviewTransition from '@preview/components/PreviewTransition'
import useMouse from '@preview/hooks/useMouse'

function Settings () {
  const [module, isActive] = useModule(ModuleKey.Settings)

  const stage = useStages(2, isActive)
  const auto = { direction: stage }
  const mouse = useMouse({
    x: 239,
    y: stage ? 400 : 162
  })

  return (
    <Flex bg="background-tertiary">
      <NavSidebar active={stage ? 8 : 1} />
      <TransitionGroup className="BAP__contentRegion" childFactory={passAuto(auto)}>
        <PreviewTransition
          key={stage}
          container={{ className: 'BAP__contentRegion' }}
          module={module}
          auto={auto}
          mouse={mouse}
        >
          {
            stage
              ? <SwitchesSection />
              : <UserProfileSection />
          }
        </PreviewTransition>
      </TransitionGroup>
    </Flex>
  )
}

export default Settings

css
`.BAP__contentRegion {
    position: relative;
    isolation: isolate;
    display: flex;
    flex: 1;
    background: var(--bap-background-primary);
}
.BAP__contentRegion > .BAP__contentRegion {
    background: none;
}`
`Preview: Settings`
