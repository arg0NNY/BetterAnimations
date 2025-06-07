import { Block, Flex, Text } from '@preview/components'
import XIcon from '@preview/components/icons/XIcon'

function CloseButton (props) {
  return (
    <Flex column align="center" gap={9} {...props}>
      <Flex w={36} h={36} center radius="50%" border="2px solid var(--bap-text-heading)">
        <XIcon size={18} />
      </Flex>
      <Text length={26} height={12} color="text-heading" />
    </Flex>
  )
}

function Section ({ children }) {
  return (
    <Block flex={1} pt={96} pl={40} pr={208} relative overflow="hidden" bg="background-primary">
      <CloseButton absolute top={92} right={132} />
      {children}
    </Block>
  )
}

export default Section
