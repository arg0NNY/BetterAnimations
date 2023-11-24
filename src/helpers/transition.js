
export function clearContainingStyles (node) {
  if (!node) return

  ['transform', 'perspective', 'filter', 'backdrop-filter', 'opacity', 'translate', 'rotate', 'scale']
    .forEach(s => node.style.removeProperty(s))
}

export function directChild (node) {
  return node && [].find.call(node.children, e => !e.getAttribute('data-animation'))
}
