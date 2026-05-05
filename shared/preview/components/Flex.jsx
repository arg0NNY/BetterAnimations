import { css } from '@style'
import clsx from 'clsx'
import Block from './Block'

function Flex ({ className, children, column, justify, align, wrap, center, gap, ...props }) {
  return (
    <Block
      {...props}
      className={clsx('BAP__flex', className)}
      style={{
        flexDirection: column && 'column',
        justifyContent: justify ?? (center && 'center'),
        alignItems: align ?? (center && 'center'),
        flexWrap: wrap && 'wrap',
        gap
      }}
    >
      {children}
    </Block>
  )
}

export default Flex

css
`.BAP__flex {
    display: flex;
    flex-shrink: 0;
    min-height: 0;
    min-width: 0;
}`
`Preview: Flex`
