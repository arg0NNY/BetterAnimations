import Section from '@preview/components/settings/Section'
import { Block, Button, Flex, Text } from '@preview/components'
import Tabs from '@preview/components/Tabs'

function UserProfileSection () {
  return (
    <Section>
      <Text length={127} height={24} color="text-heading" />
      <Tabs mt={36} tabs={[52, 56]} active={0} activeColor="brand-primary" />
      <Block mt={32} relative radius={8} bg="background-tertiary" overflow="hidden">
        <Block h={100} bg="brand-primary" mb={87} />
        <Block
          absolute
          top={76}
          left={16}
          w={82}
          h={82}
          radius="50%"
          bg="brand-primary"
          border="5px solid var(--bap-background-tertiary)"
        />
        <Text absolute top={119} left={117} length={88} height={24} color="text-heading" />
        <Button absolute top={119} right={16} width={133} />
        <Flex m={16} py={18} pl={14} pr={16} column gap={28} radius={8} bg="background-secondary">
          {
            [
              [101, 67],
              [76, 101],
              [55, 155],
              [110, 133]
            ].map((items, i) => (
              <Flex key={i} justify="space-between" align="center">
                <Flex column align="flex-start" gap={8}>
                  {items.map((length, i) => (
                    <Text key={i} length={length} color="text-heading" />
                  ))}
                </Flex>
                <Button width={60} color="text-primary" />
              </Flex>
            ))
          }
        </Flex>
      </Block>
    </Section>
  )
}

export default UserProfileSection
