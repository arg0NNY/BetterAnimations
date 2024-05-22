
export function directChild (node) {
  return node && [].find.call(node.children, e => !e.getAttribute('data-animation'))
}

export function passAuto (auto) {
  return e => {
    if (e?.props) e.props.auto = auto
    return e
  }
}
