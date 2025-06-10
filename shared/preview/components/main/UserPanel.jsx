import { css } from '@style'
import { Flex, Icon, Text } from '@preview/components'
import classNames from 'classnames'
import { use } from 'react'
import PreviewContext from '@preview/context/PreviewContext'

function UserPanel ({ active = -1, actionRefs = use(PreviewContext).userPanelActionRefs }) {
  return (
    <div className="BAP__userPanelContainer">
      <Flex className="BAP__userPanel" justify="space-between" align="center">
        <Flex align="center" gap={10}>
          <Icon size={40} radius="50%" />
          <Text length={100} />
        </Flex>
        <Flex>
          {Array(3).fill(null).map((_, i) => (
            <div
              ref={ref => { actionRefs.current[i] = ref }}
              key={i}
              className={classNames(
                'BAP__userPanelAction',
                { 'BAP__userPanelAction--active': i === active }
              )}
              >
              <Icon size={19} color="current" />
            </div>
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
    z-index: 100;
    left: 0;
    bottom: 0;
    width: 341px;
    padding: 0 8px 8px;
    box-sizing: border-box !important;
}
.BAP__userPanel {
    height: 54px;
    border-width: 1px !important;
    border-radius: 8px;
    padding: 0 8px;
    background: var(--bap-background-primary);
}
.BAP__userPanelAction {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background-color: transparent;
    color: var(--bap-text-primary);
    transition: background-color .2s, color .2s;
}
.BAP__userPanelAction--active {
    background-color: var(--bap-border-subtle);
    color: var(--bap-text-heading);
}`
`Preview: UserPanel`
