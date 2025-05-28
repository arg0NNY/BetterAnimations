
function Block ({ className, children, relative, absolute, x, y, w, h, p, px, py, pt, pr, pb, pl, m, mx, my, mt, mr, mb, ml, bg, radius, style, ...props }) {
  return (
    <div
      className={className}
      style={{
        position: relative ? 'relative' : absolute ? 'absolute' : undefined,
        top: y,
        left: x,
        width: w,
        height: h,
        padding: p,
        paddingInline: px,
        paddingBlock: py,
        paddingTop: pt,
        paddingRight: pr,
        paddingBottom: pb,
        paddingLeft: pl,
        margin: m,
        marginInline: mx,
        marginBlock: my,
        marginTop: mt,
        marginRight: mr,
        marginBottom: mb,
        marginLeft: ml,
        background: bg && `var(--bap-${bg})`,
        borderRadius: radius,
        ...props,
        ...style
      }}
    >
      {children}
    </div>
  )
}

export default Block
