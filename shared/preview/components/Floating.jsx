import { css } from '@style'
import classNames from 'classnames'

export function FloatingLayerContainer ({ className, children, ...props }) {
  return (
    <div
      className={classNames('BAP__floatingLayerContainer', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function FloatingLayer ({ className, children, ...props }) {
  return (
    <div
      className={classNames('BAP__floatingLayer', className)}
      {...props}
    >
      {children}
    </div>
  )
}

function Floating ({ ref, className, top, left, right, bottom, layer, children }) {
  return (
    <FloatingLayer {...layer}>
      <div
        ref={ref}
        className={classNames('BAP__floating', className)}
        style={{
          position: 'absolute',
          top,
          left,
          right,
          bottom
        }}
      >
        {children}
      </div>
    </FloatingLayer>
  )
}

export default Floating

css
`.BAP__floatingLayerContainer,
.BAP__floatingLayer {
    position: absolute;
    inset: 0;
    z-index: 1000;
    pointer-events: none;
    isolation: isolate;
}
.BAP__floating {
    position: absolute;
    pointer-events: all;
}`
`Preview: Floating`
