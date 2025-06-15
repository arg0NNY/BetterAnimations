import Section from '@preview/components/settings/Section'
import { Block, Flex, Text } from '@preview/components'

function Switch ({ title = 90, note = [276], active = false }) {
  return (
    <Flex relative mt={20} pt={6} pb={22} borderBottomWidth={1} column gap={16}>
      <Text length={title} color="text-heading" />
      <Flex column gap={4}>
        {note.map((length, i) => (
          <Text key={i} length={length} />
        ))}
      </Flex>
      <Block absolute top={0} right={0} w={42} h={26} radius={24} borderWidth={1}
             bg={active ? 'brand-primary' : 'text-primary'}>
        <Block absolute top={3} left={active ? 19 : 3} w={20} h={20} radius="50%" bg="white" />
      </Block>
    </Flex>
  )
}

const switches = [
  { title: 201, note: [385, 128], active: true },
  { title: 90, note: [406], active: true },
  { title: 238, note: [276], active: true },
  { title: 150, note: [339, 314], active: false },
  { title: 227, note: [171], active: true },
  { title: 212, note: [329], active: false }
]

function SwitchesSection () {
  return (
    <Section>
      <Text length={114} color="text-heading" />
      {switches.map((props, i) => (
        <Switch key={i} {...props} />
      ))}
    </Section>
  )
}

export default SwitchesSection
