
export function directChild (node) {
  return node && [].find.call(node.children, e => !e.getAttribute('data-animation'))
}

export function passAnimations (animations) {
  return e => {
    if (e?.props) e.props.animations = animations
    return e
  }
}
