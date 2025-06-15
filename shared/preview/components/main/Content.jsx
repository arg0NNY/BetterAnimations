import { css } from '@style'
import useModule from '@preview/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import { use, useMemo } from 'react'
import { server } from '@preview/data'
import useStages from '@preview/hooks/useStages'
import useMouse from '@preview/hooks/useMouse'
import { TransitionGroup } from '@discord/modules'
import { passAuto } from '@utils/transition'
import PreviewTransition from '@preview/components/PreviewTransition'
import ServerList from '@preview/components/main/ServerList'
import Server from '@preview/components/main/Server'
import UserPanel from '@preview/components/main/UserPanel'
import PreviewContext from '@preview/context/PreviewContext'

function Content () {
  const { serverList, userPanel } = use(PreviewContext)

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

  return wrap(
    <div className="BAP__content">
      <ServerList active={stage ? 7 : 2} {...serverList} />
      {wrap(
        <Server {...data[stage]} />,
        enhanceLayout
      )}
      <UserPanel {...userPanel} />
    </div>,
    !enhanceLayout
  )
}

export default Content

css
`.BAP__content {
    position: relative;
    isolation: isolate;
    display: flex;
    flex: 1;
    min-height: 0;
    min-width: 0;
}`
`Preview: Content`
