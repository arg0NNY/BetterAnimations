import { css } from '@style'
import { Flex, Icon, Text } from '@preview/components'

function UserPanel () {
  return (
    <div className="BAP__userPanelContainer">
      <Flex className="BAP__userPanel" justify="space-between" align="center">
        <Flex align="center" gap={10}>
          <Icon size={40} radius="50%" />
          <Text length={100} />
        </Flex>
        <Flex>
          {Array(3).fill(null).map((_, i) => (
            <Flex key={i} w={32} h={32} center>
              <Icon size={19} />
            </Flex>
          ))}
        </Flex>
      </Flex>
    </div>
  )
}

export default UserPanel

css
`.BAP__userPanelContainer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 341px;
    padding: 0 8px 8px;
    box-sizing: border-box;
}
.BAP__userPanel {
    height: 54px;
    border-width: 1px !important;
    border-radius: 8px;
    padding: 0 8px;
    background: var(--background-primary);
}`
`Preview: UserPanel`
