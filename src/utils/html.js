
export function attributesToProps (node) {
  return Object.fromEntries(
    Array.from(node.attributes).map(({ name, value }) => [
      name === 'class' ? 'className' : name,
      value
    ])
  )
}

export function getScrollers (node) {
  return node.querySelectorAll('[class*="scroller"]')
}

export function getScrollsMapping (node) {
  const mapping = {}
  getScrollers(node).forEach((scroller, i) => mapping[i] = scroller.scrollTop)
  return mapping
}

export function applyScrolls (node, scrollsMapping) {
  getScrollers(node).forEach((scroller, i) => scroller.scrollTop = scrollsMapping[i])
  return node
}

export function clone (node) {
  return {
    node: node.cloneNode(true),
    scrollsMapping: getScrollsMapping(node)
  }
}
