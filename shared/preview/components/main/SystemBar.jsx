import { Divider, Flex, Icon, Text } from '@preview/components'

function SystemBar () {
  return (
    <Flex relative h={32} justify="flex-end">
      <Flex absolute inset={0} center gap={8}>
        <Icon size={20} radius={4} color="text-heading" />
        <Text length={140} color="text-heading" />
      </Flex>
      <Flex align="center" gap={18} pr={12}>
        <Icon />
        <Icon />
      </Flex>
    </Flex>
  )
}

export default SystemBar
