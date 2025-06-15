import { Divider, Flex, Icon } from '@preview/components'
import { css } from '@style'
import { use } from 'react'
import PreviewContext from '@preview/context/PreviewContext'
import classNames from 'classnames'

function ServerList ({ active = -1, hover = -1, iconRefs = use(PreviewContext).serverListIconRefs }) {
  return (
    <Flex w={72} column align="center" gap={8} mb={64} bg="background-tertiary" overflow="hidden">
      <Icon size={40} radius={12} />
      <Divider length={32} />
      {Array(13).fill(null).map((_, i) => (
        <Flex key={i} center w="100%" relative>
          <div className={classNames({
            'BAP__serverPill': true,
            'BAP__serverPill--hover': i === hover,
            'BAP__serverPill--active': i === active
          })} />
          <div ref={ref => { iconRefs.current[i] = ref }}>
            <Icon size={40} radius={12} />
          </div>
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
    transform-origin: 0 0;
    opacity: 0;
    scale: .5;
    transition: opacity .2s, scale .2s, height .2s;
}
.BAP__serverPill--hover, .BAP__serverPill--active {
    opacity: 1;
    scale: 1;
}
.BAP__serverPill--active {
    height: 40px;
}`
`Preview: ServerList`
