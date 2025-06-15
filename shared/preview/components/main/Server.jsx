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
    <div className="BAP__channelListItem">
      <Flex px={8} align="center" gap={8} radius={4} flex={1} bg={active && 'background-primary'}>
        <Icon size={19} color={active && 'text-heading'} />
        <Text length={length} color={active && 'text-heading'} />
      </Flex>
    </div>
  )
}
function ChannelListSection ({ active, length }) {
  return (
    <Flex
      className={classNames({
        'BAP__channelListSection': true,
        'BAP__channelListSection--active': active
      })}
    >
      <Flex h={24} px={16} align="center" gap={4} flex={1}>
        <Text length={length} height={12} />
        {active != null && <ChevronIcon />}
      </Flex>
    </Flex>
  )
}

function ChannelList ({ name, items = [], active = -1 }) {
  const [module, isActive] = useModule(ModuleKey.ChannelList)
  const stage = useStages(4, isActive)

  const sectionIndexes = useMemo(
    () => items.map(({ type }, i) => type === 'section' ? i : -1)
      .filter(i => i !== -1)
      .concat(items.length),
    [items]
  )
  const hiddenSections = useMemo(
    () => [0, 1].slice(Math.max(0, stage - 2), stage),
    [stage]
  )

  return (
    <Flex className="BAP__channelList">
      <Flex h={48} align="center" px={14} borderBottomWidth={1}>
        <Text length={name} color="text-heading" />
      </Flex>
      <Flex column py={12} pr={8} flex={1}>
        <TransitionGroup component={null}>
          {items.map(({ type, ...props }, i) => {
            if (type === 'section') return (
              <ChannelListSection
                key={i}
                active={isActive ? !hiddenSections.some(s => i === sectionIndexes[s]) : null}
                {...props}
              />
            )

            if (
              hiddenSections.some(j => i >= sectionIndexes[j] && i < sectionIndexes[j + 1])
                && i !== active
            ) return null

            return (
              <PreviewTransition
                key={i}
                container={{ className: 'BAP__channelListItemContainer' }}
                module={module}
              >
                <ChannelListItem
                  active={i === active}
                  {...props}
                />
              </PreviewTransition>
            )
          })}
        </TransitionGroup>
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
    display: flex;
    flex-direction: column;
    width: 268px;
    padding-bottom: 64px;
    border-top-width: 1px !important;
    border-left-width: 1px !important;
    border-top-left-radius: 12px;
    background-color: var(--bap-background-tertiary);
    overflow: hidden;
}
.BAP__channelListSection {
    height: 40px;
    display: flex;
    align-items: flex-end;
}
.BAP__channelListSection svg {
    transition: .2s transform;
    transform: rotate(-90deg);
}
.BAP__channelListSection--active svg {
    transform: rotate(0);
}
.BAP__channelListItem {
    display: flex;
    align-items: stretch;
    height: 32px;
    margin-left: 8px;
    padding: 1px 0;
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
