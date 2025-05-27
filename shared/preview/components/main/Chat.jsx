import { int, stream } from '@utils/prng'
import { Block, Flex, Icon, Text } from '@preview/components'
import { memo, useMemo } from 'react'
import { css } from '@style'
import { chat } from '@preview/data'
import useModule from '@preview/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import useStages from '@preview/hooks/useStages'
import { TransitionGroup } from '@discord/modules'
import PreviewTransition from '@preview/components/PreviewTransition'

export function generateMessage (rng) {
  return {
    username: int(rng, 60, 128),
    rows: stream(
      rng,
      int(rng, 1, 4),
      () => stream(rng, int(rng, 3, 8), 30, 80)
    ),
    embed: rng() < .3
      ? [int(rng, 140, 400), int(rng, 100, 240)]
      : null
  }
}

export function generateMessageStream (rng, count) {
  return stream(rng, count, generateMessage)
}

export function Message ({ username = 40, rows = [], embed = null }) {
  return (
    <div className="BAP__message">
      <Icon size={40} radius="50%" />
      <Flex flex={1} column align="flex-start" gap={6}>
        <Text length={username} color="text-heading" />
        {rows.map((columns, i) => (
          <Flex key={i} gap={4} wrap>
            {columns.map((length, i) => <Text key={i} length={length} />)}
          </Flex>
        ))}
        {embed && (
          <Block w={embed[0]} h={embed[1]} radius={8} bg="text-primary" />
        )}
      </Flex>
    </div>
  )
}

function Chat ({ messages }) {
  const [module, isActive] = useModule(ModuleKey.Messages)

  const data = useMemo(
    () => (!isActive ? messages : chat.animatable().messages)
      .map((m, i) => ({ ...m, key: i })),
    [messages]
  )

  const stage = useStages([500, 500, 500, 500], isActive)
  const displayedMessages = useMemo(() => {
    if (!isActive) return data

    switch (stage) {
      case 0: return data.slice(0, -2)
      case 1: return data.slice(0, -1)
      case 2: return data
      case 3: return data.slice(0, -2).concat(data.at(-1))
    }
  }, [data, stage])

  return (
    <Flex flex={1} column>
      <Block relative flex={1} overflow="hidden">
        <Flex className="BAP__messages" flex={1} column>
          <TransitionGroup component={null}>
            {displayedMessages.map(({ key, ...props }) => (
              <PreviewTransition
                key={key}
                container={{ className: 'BAP__messageContainer' }}
                module={module}
              >
                <Message {...props} />
              </PreviewTransition>
            ))}
          </TransitionGroup>
        </Flex>
      </Block>
      <Block px={8} pb={24} mt={-4} bg="background-secondary">
        <Block h={50} bg="background-primary" radius={8} borderWidth={1} />
      </Block>
    </Flex>
  )
}

export default memo(Chat)

css
`.BAP__messages {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding-right: 16px;
    padding-bottom: 16px;
    box-sizing: border-box;
}
.BAP__messageContainer {
    margin-top: 16px;
}
.BAP__message {
    display: flex;
    gap: 16px;
    padding: 4px 0 2px 16px;
}`
`Preview: Chat`