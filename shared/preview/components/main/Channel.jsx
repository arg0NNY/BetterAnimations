import { css } from '@style'
import { Block, Flex, Icon, Text } from '@preview/components'
import Chat from '@preview/components/main/Chat'

function ChannelHeader ({ name, description }) {
  return (
    <Flex h={48} pl={21} pr={8} justify="space-between" borderBottomWidth={1}>
      <Flex align="center" gap={8}>
        <Icon color="text-heading" />
        <Text length={name} color="text-heading" />
        <Text length={description} />
      </Flex>
      <Flex align="center" gap={18}>
        <Icon />
        <Icon />
        <Icon />
        <Icon color="text-heading" />
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
    <Flex w={247} px={8} py={20} column gap={20} borderLeftWidth={1} overflow="hidden">
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
    </Flex>
  )
}

function ThreadSidebar () {

}

function Channel ({ header, chat, memberList }) {
  return (
    <div className="BAP__channel">
      <Flex column bg="background-secondary" flex={1} borderTopWidth={1}>
        <ChannelHeader {...header} />
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
}`
`Preview: Channel`
