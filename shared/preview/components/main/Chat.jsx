import { int, stream } from '@utils/prng'
import { Block, Flex, Icon, Text } from '@preview/components'
import { memo, useEffect, useMemo, useState } from 'react'
import { css } from '@style'
import { chat } from '@preview/data'
import useModule from '@preview/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import useStages from '@preview/hooks/useStages'
import { TransitionGroup } from '@discord/modules'
import PreviewTransition from '@preview/components/PreviewTransition'

export function generateMessage (rng, key = null) {
  return {
    key,
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
          <Flex key={i} gap="6px 4px" wrap>
            {columns.map((length, i) => <Text key={i} length={length} />)}
          </Flex>
        ))}
        {embed && (
          <Block w={embed[0]} h={embed[1]} maxWidth="100%" radius={8} bg="text-primary" />
        )}
      </Flex>
    </div>
  )
}

function Chat ({ messages, rng }) {
  const [module, isActive] = useModule(ModuleKey.Messages)

  const [data, setData] = useState(messages)
  useEffect(() => setData(messages), [messages])

  const stage = useStages(Infinity, isActive)
  useEffect(() => {
    if (stage === 0) return

    setData(data => {
      if (rng() < .2) {
        const index = data.length - int(rng, 1, 4)
        return data.slice(0, index).concat(data.slice(index + 1))
      }

      return data.slice(-10)
        .concat(generateMessage(rng, messages.length + stage))
    })
  }, [stage])

  return (
    <Flex flex={1} column bg="background-secondary">
      <Block relative flex={1} overflow="hidden">
        <Flex className="BAP__messages" flex={1} column>
          <TransitionGroup component={null}>
            {data.map(({ key, ...props }, i) => (
              <PreviewTransition
                key={key}
                container={{ className: 'BAP__messageContainer' }}
                module={module}
                enter={i > 1}
                exit={i > 1}
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
    box-sizing: border-box !important;
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