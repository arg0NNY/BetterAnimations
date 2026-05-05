import { css } from '@style'
import clsx from 'clsx'

function Divider ({ className, gap, ...props }) {
  return (
    <div
      className={clsx('BA__divider', className)}
      style={{
        marginTop: gap,
        marginBottom: gap
      }}
      {...props}
    />
  )
}

export default Divider

css
`.BA__divider {
    border-top: thin solid var(--border-subtle);
    height: 1px;
    width: 100%;
}`
`Divider`
