
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
        paddingTop: pt ?? py ?? p,
        paddingRight: pr ?? px ?? p,
        paddingBottom: pb ?? py ?? p,
        paddingLeft: pl ?? px ?? p,
        marginTop: mt ?? my ?? m,
        marginRight: mr ?? mx ?? m,
        marginBottom: mb ?? my ?? m,
        marginLeft: ml ?? mx ?? m,
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
