import { css } from '@style'

export function FloatingLayerContainer ({ children }) {
  return (
    <div className="BAP__floatingLayerContainer">
      {children}
    </div>
  )
}

function FloatingLayer ({ children }) {
  return (
    <div className="BAP__floatingLayer">
      {children}
    </div>
  )
}

function Floating ({ ref, top, left, right, bottom, children }) {
  return (
    <FloatingLayer>
      <div
        ref={ref}
        className="BAP__floating"
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
