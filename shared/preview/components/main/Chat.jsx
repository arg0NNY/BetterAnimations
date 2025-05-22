import { int, stream } from '@utils/prng'
import { Block, Flex, Icon, Text } from '@preview/components'
import { memo } from 'react'
import { css } from '@style'

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
    <Flex pl={16} pt={4} pb={2} mt={16} gap={16}>
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
    </Flex>
  )
}

function Chat ({ rng, count = 8 }) {
  const messages = generateMessageStream(rng, count)

  return (
    <Flex flex={1} column>
      <Block relative flex={1} overflow="hidden">
        <Flex className="BAP__messages" flex={1} column>
          {messages.map((props, i) => <Message key={i} {...props} />)}
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
}`
`Preview: Chat`