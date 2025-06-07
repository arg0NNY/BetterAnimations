import { css } from '@style'
import classNames from 'classnames'
import Block from '@preview/components/Block'

function Rect ({ className, width, height, radius, color, ...props }) {
  return (
    <Block
      {...props}
      className={classNames('BAP__rect', className)}
      style={{
        width,
        height,
        borderRadius: radius,
        background: color && `var(--bap-${color})`
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
      className="BAP__divider"
      {...params}
    />
  )
}

export function Button ({ color = 'brand-primary', ...props }) {
  return (
    <Rect
      {...props}
      className="BAP__button"
      color={color}
    />
  )
}

export default Rect

css
`.BAP__rect {
    display: inline-block;
    background: var(--bap-text-primary);
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
.BAP__divider {
    width: 1px;
    height: 1px;
    background: var(--bap-border-subtle);
}
.BAP__button {
    width: 80px;
    height: 32px;
    border-width: 1px !important;
    border-radius: 8px;
}`
`Preview: Rect`
