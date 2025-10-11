import { css } from '@style'
import classNames from 'classnames'

function Divider ({ className, gap, ...props }) {
  return (
    <div
      className={classNames('BA__divider', className)}
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
