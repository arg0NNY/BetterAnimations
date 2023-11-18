
export function clearContainingStyles (node) {
  if (!node) return

  ['transform', 'perspective', 'filter', 'backdrop-filter', 'opacity', 'translate', 'rotate', 'scale']
    .forEach(s => node.style.removeProperty(s))
}
