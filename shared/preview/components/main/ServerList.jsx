import { Block, Divider, Flex, Icon } from '@preview/components'
import { css } from '@style'

function ServerList ({ active = -1, hover = -1 }) {
  return (
    <Flex w={72} column align="center" gap={8} mb={64} bg="background-tertiary" overflow="hidden">
      <Icon size={40} radius={12} />
      <Divider length={32} />
      {Array(13).fill(null).map((_, i) => (
        <Flex key={i} center w="100%" relative>
          {[active, hover].includes(i) && (
            <Block className="BAP__serverPill" h={i === active ? 40 : 20} />
          )}
          <Icon size={40} radius={12} />
        </Flex>
      ))}
    </Flex>
  )
}

export default ServerList

css
`.BAP__serverPill {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 4px;
    height: 20px;
    border-radius: 0 5px 5px 0;
    background-color: var(--bap-white);
}`
`Preview: ServerList`
