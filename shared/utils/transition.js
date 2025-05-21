
export function directChild (node) {
  return node && [].find.call(node.children, e => !e.getAttribute('data-baa'))
}

export function pass (props) {
  return e => {
    if (e?.props) Object.assign(e.props, props)
    return e
  }
}

export function passAuto (auto) {
  return pass({ auto })
}
