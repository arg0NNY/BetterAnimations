import { css } from '@style'
import classNames from 'classnames'

function Rect ({ className, width, height, radius, color }) {
  return (
    <div
      className={classNames('BAP__rect', className)}
      style={{
        width,
        height,
        borderRadius: radius,
        background: color && `var(--${color})`
      }}
    />
  )
}

export function Text ({ length, ...props }) {
  return (
    <Rect
      {...props}
      className="BAP__text"
      width={length}
    />
  )
}

export function Icon ({ size, ...props }) {
  return (
    <Rect
      {...props}
      className="BAP__icon"
      width={size}
      height={size}
    />
  )
}

export function Divider ({ vertical = false, length, ...props }) {
  const params = vertical ? { height: length } : { width: length }
  return (
    <Rect
      {...props}
      className="BA__divider"
      {...params}
    />
  )
}

export default Rect

css
`.BAP__rect {
    display: inline-block;
    background: var(--text-primary);
    width: 20px;
    height: 20px;
    border-radius: 8px;
    flex-shrink: 0;
}
.BAP__text {
    width: 40px;
    height: 16px;
    border-radius: 999px;
}
.BAP__icon {
    width: 22px;
    height: 22px;
}
.BA__divider {
    width: 1px;
    height: 1px;
    background: var(--border-subtle);
}`
`Preview: Rect`
