import { css } from '@style'
import { Block, Flex, Icon, Text } from '@preview/components'
import Chat from '@preview/components/main/Chat'
import useModule from '@preview/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import useStages from '@preview/hooks/useStages'
import PreviewTransition from '@preview/components/PreviewTransition'
import useMouse from '@preview/hooks/useMouse'

function ChannelHeader ({ name, description, items = [0, 0, 0, 1] }) {
  return (
    <Flex h={48} pl={21} pr={8} justify="space-between" borderBottomWidth={1} bg="background-secondary">
      <Flex align="center" gap={8}>
        <Icon color="text-heading" />
        <Text length={name} color="text-heading" />
        <Text length={description} />
      </Flex>
      <Flex align="center" gap={18}>
        {items.map((active, i) => (
          <Icon key={i} color={active ? 'text-heading' : 'text-primary'} />
        ))}
        <Block w={244} h={32} radius={8} bg="background-secondary-alt" borderWidth={1} />
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
  return (
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
  )
}

function ThreadSidebar () {

}

function Channel ({ header, chat, memberList }) {
  const [module, isActive] = useModule(ModuleKey.MembersSidebar)
  const stage = useStages(2, isActive)
  const mouse = useMouse({ x: 997, y: 57 })

  return (
    <div className="BAP__channel">
      <Flex column bg="background-tertiary" flex={1} borderTopWidth={1}>
        <ChannelHeader {...header} items={[0, 0, 0, !stage]} />
        <Flex align="stretch" flex={1}>
          <Chat {...chat} />
          <PreviewTransition
            in={!stage}
            container={{ className: 'BAP__sidebar' }}
            module={module}
            mouse={mouse}
          >
            <MemberList {...memberList} />
          </PreviewTransition>
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
}
.BAP__sidebar {
    display: flex;
    flex-direction: column;
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
}`
`Preview: Channel`
