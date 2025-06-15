import { css } from '@style'
import Floating from '@preview/components/Floating'
import classNames from 'classnames'
import Position from '@enums/Position'

function Tooltip ({ children, position = Position.Top, ...props }) {
  return (
    <Floating {...props}>
      <div className={classNames(
        'BAP__tooltip',
        `BAP__tooltip--${position}`
      )}>
        {children}
        <div className="BAP__tooltipArrow" />
      </div>
    </Floating>
  )
}

export default Tooltip

css
`.BAP__tooltip {
    position: relative;
    padding: 8px;
    border-radius: 5px;
    background-color: var(--bap-background-surface-overlay);
    border-width: 1px !important;
    box-shadow: 0 12px 24px 0 rgba(0, 0, 0, .24);
}
.BAP__tooltipArrow {
    position: absolute;
    top: var(--arrow-top);
    left: var(--arrow-left);
    bottom: var(--arrow-bottom);
    right: var(--arrow-right);
    translate: var(--arrow-translate);
    width: 20px;
    height: 20px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
}
.BAP__tooltipArrow::before {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background-color: var(--bap-background-surface-overlay);
    border: 1px solid var(--bap-border-subtle);
    rotate: 45deg;
    translate: var(--arrow-translate-inner);
}
.BAP__tooltip--top {
    --arrow-top: 100%;
    --arrow-left: 50%;
    --arrow-translate: -50% 0;
    --arrow-translate-inner: 0 -10px;
}
.BAP__tooltip--bottom {
    --arrow-bottom: 100%;
    --arrow-left: 50%;
    --arrow-translate: -50% 0;
    --arrow-translate-inner: 0 10px;
}
.BAP__tooltip--left {
    --arrow-left: 100%;
    --arrow-top: 50%;
    --arrow-translate: 0 -50%;
    --arrow-translate-inner: -10px 0;
}
.BAP__tooltip--right {
    --arrow-right: 100%;
    --arrow-top: 50%;
    --arrow-translate: 0 -50%;
    --arrow-translate-inner: 10px 0;
}`
`Preview: Tooltip`
