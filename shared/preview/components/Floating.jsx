import { css } from '@style'

function Floating ({ ref, top, left, right, bottom, children }) {
  return (
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
  )
}

export default Floating

css
`.BAP__floating {
    position: absolute;
    z-index: 100;
}`
`Preview: Floating`
