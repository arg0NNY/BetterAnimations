import Tooltip from '@preview/components/Tooltip'
import { Flex, Icon, Text } from '@preview/components'
import Position from '@enums/Position'
import useModule from '@preview/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import useStages from '@preview/hooks/useStages'
import PreviewTransition from '@preview/components/PreviewTransition'
import { use, useEffect, useRef } from 'react'
import PreviewContext from '@preview/context/PreviewContext'

function AnimatedTooltip ({ position, align = Position.Center, top, left, children, ...props }) {
  const containerRef = useRef()
  const [module] = useModule(ModuleKey.Tooltips)

  return (
    <PreviewTransition
      containerRef={containerRef}
      module={module}
      auto={{ position, align }}
      {...props}
    >
      <Tooltip
        ref={containerRef}
        position={position}
        top={top}
        left={left}
      >
        {children}
      </Tooltip>
    </PreviewTransition>
  )
}

function Tooltips () {
  const {
    userPanelActionRefs,
    serverListIconRefs,
    setUserPanel,
    setServerList
  } = use(PreviewContext)

  const [, isActive] = useModule(ModuleKey.Tooltips)
  const stage = useStages(4, isActive)

  const userPanelActionIndex = 0
  useEffect(() => {
    if (isActive) setUserPanel(stage === 1 ? { active: userPanelActionIndex } : {})
  }, [stage])

  const serverListIconIndex = 9
  useEffect(() => {
    if (isActive) setServerList(stage === 3 ? { hover: serverListIconIndex } : {})
  }, [stage])

  if (!isActive) return null

  return (
    <>
      <AnimatedTooltip
        in={stage === 1}
        top={625}
        left={190}
        position={Position.Top}
        anchor={() => userPanelActionRefs.current[userPanelActionIndex]}
      >
        <Text length={90} />
      </AnimatedTooltip>
      <AnimatedTooltip
        in={stage === 3}
        top={497}
        left={68}
        position={Position.Right}
        anchor={() => serverListIconRefs.current[serverListIconIndex]}
      >
        <Flex column gap={8}>
          <Text length={140} color="text-heading" />
          <Flex gap={8} align="center">
            <Icon size={19} />
            <Flex>
              {Array(4).fill(null).map((_, i) => (
                <Icon key={i} size={24} radius="50%" mr={-5}
                      boxShadow="0 0 0 2px var(--bap-background-surface-overlay)" />
              ))}
            </Flex>
          </Flex>
          <Text length={37} />
        </Flex>
      </AnimatedTooltip>
    </>
  )
}

export default Tooltips
