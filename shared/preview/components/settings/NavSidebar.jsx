import { Block, Flex, Text } from '@preview/components'

const items = [
  { type: 'title', length: 96 },
  { type: 'section', length: 85 },
  { type: 'section', length: 56 },
  { type: 'section', length: 119 },
  { type: 'section', length: 105 },
  { type: 'section', length: 98 },
  { type: 'section', length: 118 },
  { type: 'section', length: 56 },
  { type: 'section', length: 90 },
  { type: 'section', length: 38 },
  { type: 'divider' },
  { type: 'title', length: 121 },
  { type: 'section', length: 38 },
  { type: 'section', length: 92 },
  { type: 'section', length: 97 },
  { type: 'section', length: 98 },
  { type: 'section', length: 46 },
  { type: 'divider' },
  { type: 'title', length: 90 }
]

function Title ({ length }) {
  return (
    <Flex h={24} px={8} align="center">
      <Text length={length} height={12} color="background-primary" />
    </Flex>
  )
}

function Section ({ length, active = false }) {
  return (
    <Flex h={32} radius={4} px={8} align="center" bg={active && 'background-primary'}>
      <Text length={length} color={active && 'text-heading'} />
    </Flex>
  )
}

function Divider () {
  return (
    <Flex h={17} px={10} align="center">
      <Block h={1} flex={1} bg="border-subtle" />
    </Flex>
  )
}

function NavSidebar ({ active = -1 }) {
  return (
    <Flex w={238} pt={60} pl={120} pr={14} column gap={22}>
      <Block h={36} radius={8} borderWidth={1} />
      <Flex column gap={2}>
        {items.map(({ type, ...props }, i) => {
          switch (type) {
            case 'title': return <Title key={i} {...props} />
            case 'divider': return <Divider key={i} {...props} />
            case 'section': return <Section key={i} active={i === active} {...props} />
          }
        })}
      </Flex>
    </Flex>
  )
}

export default NavSidebar
