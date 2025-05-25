import SystemBar from '@preview/components/main/SystemBar'
import ServerList from '@preview/components/main/ServerList'
import { Flex } from '@preview/components'
import Server from '@preview/components/main/Server'
import UserPanel from '@preview/components/main/UserPanel'
import { server } from '@preview/data'
import { useMemo } from 'react'
import { css } from '@style'
import { TransitionGroup } from '@discord/modules'
import useModule from '@preview/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import useStages from '@preview/hooks/useStages'
import PreviewTransition from '@preview/components/PreviewTransition'
import { passAuto } from '@utils/transition'
import useMouse from '@preview/hooks/useMouse'

function Main () {
  const data = useMemo(() => [server.main(), server.alt()], [])

  const [module, isActive] = useModule(ModuleKey.Servers)
  const stage = useStages([500, 500], isActive)
  const auto = { direction: stage }
  const mouse = useMouse({
    x: 36,
    y: stage ? 445 : 205
  })

  return (
    <Flex column>
      <SystemBar />
      <Flex align="stretch" flex={1}>
        <ServerList active={stage ? 7 : 2} />
        <TransitionGroup className="BAP__content" childFactory={passAuto(auto)}>
          <PreviewTransition
            key={stage}
            container={{ className: 'BAP__content' }}
            module={module}
            auto={auto}
            mouse={mouse}
          >
            <Server {...data[stage]} />
          </PreviewTransition>
        </TransitionGroup>
      </Flex>
      <UserPanel />
    </Flex>
  )
}

export default Main

css
`.BAP__content {
    position: relative;
    isolation: isolate;
    display: flex;
    flex: 1;
}`
`Preview: Main`
