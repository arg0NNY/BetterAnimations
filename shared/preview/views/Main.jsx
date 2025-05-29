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
  const [module, isActive] = useModule(ModuleKey.Servers)
  const enhanceLayout = module.settings.enhanceLayout ?? true

  const data = useMemo(() => [server.main(), server.alt()], [])

  const stage = useStages(2, isActive)
  const auto = { direction: stage }
  const mouse = useMouse({
    x: 36,
    y: stage ? 445 : 205
  })

  const wrap = (children, enabled = false) => enabled ? (
    <TransitionGroup className="BAP__content" childFactory={passAuto(auto)}>
      <PreviewTransition
        key={stage}
        container={{ className: 'BAP__content' }}
        module={module}
        auto={auto}
        mouse={mouse}
      >
        {children}
      </PreviewTransition>
    </TransitionGroup>
  ) : children

  return (
    <Flex column>
      <SystemBar />
      {wrap(
        <Flex className="BAP__content">
          <ServerList active={stage ? 7 : 2} />
          {wrap(
            <Server {...data[stage]} />,
            enhanceLayout
          )}
          <UserPanel />
        </Flex>,
        !enhanceLayout
      )}
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
    min-height: 0;
}`
`Preview: Main`
