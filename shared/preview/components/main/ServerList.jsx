import { Divider, Flex, Icon } from '@preview/components'

function ServerList () {
  return (
    <Flex w={72} column align="center" gap={8} mb={64} bg="background-tertiary" overflow="hidden">
      <Icon size={40} radius={12} />
      <Divider length={32} />
      {Array(13).fill(null).map((_, i) => (
        <Icon key={i} size={40} radius={12} />
      ))}
    </Flex>
  )
}

export default ServerList
