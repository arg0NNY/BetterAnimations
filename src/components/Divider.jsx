import { css } from '@style'
import classNames from 'classnames'

function Divider ({ className, ...props }) {
  return (
    <div
      className={classNames('BA__divider', className)}
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
