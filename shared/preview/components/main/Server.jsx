import { css } from '@style'
import { Flex, Icon, Text } from '@preview/components'
import ChevronIcon from '@preview/components/icons/ChevronIcon'
import classNames from 'classnames'
import Channel from '@preview/components/main/Channel'
import useModule from '@preview/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import { useMemo } from 'react'
import { channel as channelData } from '@preview/data'
import useStages from '@preview/hooks/useStages'
import { TransitionGroup } from '@discord/modules'
import PreviewTransition from '@preview/components/PreviewTransition'
import { passAuto } from '@utils/transition'
import useMouse from '@preview/hooks/useMouse'

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

function ChannelList ({ name, items = [], active = -1 }) {
  return (
    <Flex className="BAP__channelList" w={268} pb={64} bg="background-tertiary" column>
      <Flex h={48} align="center" px={14} borderBottomWidth={1}>
        <Text length={name} color="text-heading" />
      </Flex>
      <Flex column py={12} pr={8} flex={1}>
        {items.map(({ type, ...props }, i) => {
          switch (type) {
            case 'section': return <ChannelListSection key={i} {...props} />
            case 'channel': return <ChannelListItem key={i} active={i === active} {...props} />
          }
        })}
      </Flex>
    </Flex>
  )
}

function Server ({ channelList, channel }) {
  const [module, isActive] = useModule(ModuleKey.Channels)

  const data = useMemo(
    () => !isActive ? [channel, channel] : [channelData.main(), channelData.alt()],
    [channel]
  )

  const stage = useStages(2, isActive)
  const auto = { direction: stage }
  const mouse = useMouse({
    x: 207,
    y: stage ? 463 : 253
  })

  return (
    <div className="BAP__server">
      <ChannelList
        {...channelList}
        active={isActive ? (stage ? 10 : 4) : channelList.active}
      />
      <TransitionGroup className="BAP__page" childFactory={passAuto(auto)}>
        <PreviewTransition
          key={stage}
          container={{ className: 'BAP__page' }}
          module={module}
          auto={auto}
          mouse={mouse}
        >
          <Channel {...data[stage]} />
        </PreviewTransition>
      </TransitionGroup>
    </div>
  )
}

export default Server

css
`.BAP__server {
    display: flex;
    align-items: stretch;
    flex: 1;
    min-width: 0;
}
.BAP__channelList {
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
}
.BAP__page {
    position: relative;
    isolation: isolate;
    display: flex;
    align-items: stretch;
    flex: 1;
    min-width: 0;
}`
`Preview: Server`
