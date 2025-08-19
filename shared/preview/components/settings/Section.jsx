import { Flex, Text } from '@preview/components'
import XIcon from '@preview/components/icons/XIcon'
import { css } from '@style'

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
    <div className="BAP__section">
      <CloseButton absolute top={92} right={132} />
      {children}
    </div>
  )
}

export default Section

css
`.BAP__section {
    position: relative;
    flex: 1;
    padding: 96px 208px 0 40px;
    overflow: hidden;
    background-color: var(--bap-background-primary);
}`
`Preview: Section`
