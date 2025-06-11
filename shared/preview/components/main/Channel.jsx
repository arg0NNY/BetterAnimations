import { css } from '@style'
import { Block, Flex, Icon, Text } from '@preview/components'
import Chat from '@preview/components/main/Chat'
import useModule from '@preview/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import useStages from '@preview/hooks/useStages'
import PreviewTransition from '@preview/components/PreviewTransition'
import useMouse from '@preview/hooks/useMouse'
import { use, useEffect, useMemo } from 'react'
import { thread as threadData } from '@preview/data'
import PreviewContext from '@preview/context/PreviewContext'
import { TransitionGroup } from '@discord/modules'

function ChannelHeader ({ name, description, items = [0, 0, 0, 1], search = true }) {
  return (
    <Flex h={48} pl={21} pr={8} justify="space-between" borderBottomWidth={1} bg="background-secondary">
      <Flex relative align="center" gap={8} flex={1} overflow="hidden">
        <Icon color="text-heading" />
        <Text length={name} color="text-heading" />
        {description && (
          <Text length={description} />
        )}
        <Block absolute top={0} right={0} bottom={0} w={8}
               background="linear-gradient(to right, transparent, var(--bap-background-secondary))" />
      </Flex>
      <Flex pl={8} align="center" gap={18}>
        {items.map((active, i) => (
          <Icon key={i} color={active ? 'text-heading' : 'text-primary'} />
        ))}
        {search && (
          <Block w={244} h={32} radius={8} bg="background-secondary-alt" borderWidth={1} />
        )}
      </Flex>
    </Flex>
  )
}

function MemberListItem ({ active = false, length }) {
  return (
    <Flex px={16} py={4} align="center" gap={12} radius={8} bg={active && 'background-primary'}>
      <Icon size={32} radius="50%" color={active && 'text-heading'} />
      <Text length={length} color={active && 'text-heading'} />
    </Flex>
  )
}
function MemberList ({ sections = [] }) {
  const { memberListShown, setMemberListShown } = use(PreviewContext)

  const [module, isActive] = useModule(ModuleKey.MembersSidebar)
  const stage = useStages(2, isActive)
  const mouse = useMouse({ x: 997, y: 57 })

  useEffect(() => {
    if (isActive) setMemberListShown(!stage, true)
  }, [stage])

  return (
    <PreviewTransition
      in={memberListShown}
      container={{ className: 'BAP__sidebar' }}
      module={module}
      mouse={mouse}
    >
      <div className="BAP__memberList">
        {sections.map(({ length, items = [] }, i) => (
          <Flex key={i} column gap={2}>
            <Flex px={8} pb={4}>
              <Text length={length} height={12} />
            </Flex>
            {items.map((props, i) => (
              <MemberListItem key={i} {...props} />
            ))}
          </Flex>
        ))}
      </div>
    </PreviewTransition>
  )
}

function ThreadSidebar () {
  const { setMemberListShown } = use(PreviewContext)

  const data = useMemo(() => [threadData.main(), threadData.alt()], [])

  const [module, isActive] = useModule(ModuleKey.ThreadSidebar)
  const [switchModule, isSwitchActive] = useModule(ModuleKey.ThreadSidebarSwitch)

  const stage = useStages(2, isActive || isSwitchActive)
  const key = isSwitchActive ? stage : 0

  useEffect(() => {
    if (isActive) setMemberListShown(!stage, !!stage)
  }, [stage])

  if (!isActive && !isSwitchActive) return null

  return (
    <PreviewTransition
      in={!!stage || isSwitchActive}
      container={{ className: 'BAP__sidebar' }}
      module={module}
    >
      <TransitionGroup component={null}>
        <PreviewTransition
          key={key}
          container={{ className: 'BAP__sidebar' }}
          module={switchModule}
        >
          <div className="BAP__threadSidebar">
            <Block w={8} />
            <Flex className="BAP__threadSidebarContents">
              <ChannelHeader {...data[key].header} items={[0, 0, 0]} search={false} />
              <Chat {...data[key].chat} />
            </Flex>
          </div>
        </PreviewTransition>
      </TransitionGroup>
    </PreviewTransition>
  )
}

function Channel ({ header, chat, memberList }) {
  const { memberListShown } = use(PreviewContext)

  return (
    <div className="BAP__channel">
      <Flex className="BAP__channelContents">
        <ChannelHeader {...header} items={[0, 0, 0, memberListShown]} />
        <Flex align="stretch" flex={1}>
          <Chat {...chat} />
          <MemberList {...memberList} />
        </Flex>
      </Flex>
      <ThreadSidebar />
    </div>
  )
}

export default Channel

css
`.BAP__channel {
    display: flex;
    align-items: stretch;
    flex: 1;
    min-width: 0;
}
.BAP__channelContents {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: var(--bap-background-tertiary);
    border-top-width: 1px !important;
    overflow: clip;
}
.BAP__sidebar {
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    height: 100%;
}
.BAP__memberList {
    width: 247px;
    padding: 20px 8px;
    background-color: var(--bap-background-secondary);
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-left-width: 1px !important;
    overflow: hidden;
}
.BAP__threadSidebar {
    width: 458px;
    display: flex;
    align-items: stretch;
    height: 100%;
}
.BAP__threadSidebarContents {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-top-width: 1px !important;
    border-left-width: 1px !important;
    border-radius: 8px 0 0 8px;
    overflow: clip;
}
.BAP__channel:has(.BAP__threadSidebar) .BAP__channelContents {
    border-right-width: 1px !important;
    border-radius: 0 8px 8px 0;
}`
`Preview: Channel`
