import { Block, Flex, Text } from '@preview/components'

function Tab ({ length, active = false, activeColor = 'text-heading' }) {
  return (
    <Flex mb={-1} column justify="space-between">
      <Text length={length} color={active && activeColor} height={12} />
      {active && (
        <Block h={2} bg={activeColor} />
      )}
    </Flex>
  )
}

function Tabs ({ tabs = [], active = -1, activeColor, gap = 55, h = 24, ...props }) {
  return (
    <Flex gap={gap} h={h - 1} align="stretch" borderBottomWidth={1} {...props}>
      {tabs.map((length, i) => (
        <Tab
          key={i}
          length={length}
          active={i === active}
          activeColor={activeColor}
        />
      ))}
    </Flex>
  )
}

export default Tabs
