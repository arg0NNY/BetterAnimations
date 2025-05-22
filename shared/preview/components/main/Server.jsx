import { css } from '@style'
import { Flex, Icon, Text } from '@preview/components'
import ChevronIcon from '@preview/components/icons/ChevronIcon'
import classNames from 'classnames'
import Channel from '@preview/components/main/Channel'

function ChannelListItem ({ active = false, length }) {
  return (
    <Flex pl={8} py={1} h={32} align="stretch">
      <Flex px={8} align="center" gap={8} radius={4} flex={1} bg={active && 'background-primary'}>
        <Icon size={19} color={active && 'text-heading'} />
        <Text length={length} color={active && 'text-heading'} />
      </Flex>
    </Flex>
  )
}

function ChannelListSection ({ active, length }) {
  return (
    <Flex
      className={classNames('BAP__channelListSection', {
        'BAP__channelListSection--active': active
      })}
      h={40}
      align="flex-end"
    >
      <Flex h={24} px={16} align="center" gap={4} flex={1}>
        <Text length={length} height={12} />
        {active != null && <ChevronIcon />}
      </Flex>
    </Flex>
  )
}

function ChannelList ({ name, items = [] }) {
  return (
    <Flex className="BAP__channelList" w={268} pb={64} bg="background-tertiary" column>
      <Flex h={48} align="center" px={14} borderBottomWidth={1}>
        <Text length={name} color="text-heading" />
      </Flex>
      <Flex column py={12} pr={8} flex={1}>
        {items.map(({ type, ...props }, i) => {
          switch (type) {
            case 'section': return <ChannelListSection key={i} {...props} />
            case 'channel': return <ChannelListItem key={i} {...props} />
          }
        })}
      </Flex>
    </Flex>
  )
}

function Server ({ channelList, channel }) {
  return (
    <Flex align="stretch" flex={1}>
      <ChannelList {...channelList} />
      <Channel {...channel} />
    </Flex>
  )
}

export default Server

css
`.BAP__channelList {
    border-top-width: 1px !important;
    border-left-width: 1px !important;
    border-top-left-radius: 12px;
    overflow: hidden;
}
.BAP__channelListSection svg {
    transition: .2s transform;
    transform: rotate(-90deg);
}
.BAP__channelListSection--active svg {
    transform: rotate(0);
}`
`Preview: Server`
